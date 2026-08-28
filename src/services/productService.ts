import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, ProductFilterState } from '../types';
import { MOCK_PRODUCTS } from './mockData';

const LOCAL_STORAGE_PRODUCTS_KEY = 'luxe_products_v5';

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
  return MOCK_PRODUCTS;
};

const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn('localStorage quota exceeded, optimizing image cache:', err);
    try {
      // Sanitize oversized base64 strings if storage limit is reached
      const sanitized = products.map(p => ({
        ...p,
        images: p.images.map(img => (img.length > 300000 ? '/images/lampara_bowie_1786563431628.jpg' : img))
      }));
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(sanitized));
    } catch {
      // Graceful fallback
    }
  }
};

export const productService = {
  async getProducts(filters?: Partial<ProductFilterState>): Promise<Product[]> {
    let localProducts = getStoredProducts();

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('products').select('*');

        if (filters?.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }
        if (filters?.style && filters.style !== 'all') {
          query = query.eq('style', filters.style);
        }
        if (filters?.inStockOnly) {
          query = query.gt('stock', 0);
        }
        if (filters?.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
          query = query.lte('price', filters.maxPrice);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const supabaseProducts = data as Product[];
          
          // Merge Supabase products with any newly added local products (by slug or id)
          const mergedMap = new Map<string, Product>();
          
          // 1. Add Supabase products
          supabaseProducts.forEach(p => mergedMap.set(p.id || p.slug, p));
          
          // 2. Add local products if not already in Supabase
          localProducts.forEach(p => {
            const key = p.id || p.slug;
            if (!mergedMap.has(key)) {
              mergedMap.set(key, p);
            }
          });

          const mergedProducts = Array.from(mergedMap.values());
          saveStoredProducts(mergedProducts);
          localProducts = mergedProducts;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local product dataset', err);
      }
    }

    // Apply Filters
    let result = [...localProducts];

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        result = result.filter(p => p.category === filters.category);
      }
      if (filters.style && filters.style !== 'all') {
        result = result.filter(p => p.style === filters.style);
      }
      if (filters.inStockOnly) {
        result = result.filter(p => p.stock > 0);
      }
      if (filters.minPrice !== undefined) {
        const minVal = filters.minPrice;
        result = result.filter(p => p.price >= minVal);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        const maxVal = filters.maxPrice;
        result = result.filter(p => p.price <= maxVal);
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.style.toLowerCase().includes(q) ||
          (p.brand_collection && p.brand_collection.toLowerCase().includes(q)) ||
          (p.materials && p.materials.toLowerCase().includes(q))
        );
      }
      if (filters.sortBy) {
        result.sort((a, b) => {
          if (filters.sortBy === 'price-asc') return a.price - b.price;
          if (filters.sortBy === 'price-desc') return b.price - a.price;
          if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
          return 0;
        });
      }
    }

    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as Product;
      } catch {
        // fallback
      }
    }
    const products = getStoredProducts();
    return products.find(p => p.slug === slug) || null;
  },

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const generatedId = `prod-${Date.now()}`;
    
    // Clean payload for Supabase insertion
    const cleanPayload = {
      name: productData.name,
      slug: productData.slug,
      brand_collection: productData.brand_collection || 'Diseño Tu Espacio Collection',
      description: productData.description || '',
      price: Number(productData.price),
      original_price: productData.original_price ? Number(productData.original_price) : null,
      category: productData.category,
      style: productData.style,
      stock: Number(productData.stock),
      images: productData.images || [],
      colors: productData.colors || [],
      is_featured: !!productData.is_featured,
      dimensions: productData.dimensions || '',
      materials: productData.materials || ''
    };

    let createdProduct: Product = {
      ...cleanPayload,
      id: generatedId,
      original_price: productData.original_price ? Number(productData.original_price) : undefined
    };

    // 1. Always update local storage first so state is saved immediately on current device
    const currentLocal = getStoredProducts();
    const updatedLocal = [createdProduct, ...currentLocal.filter(p => p.slug !== createdProduct.slug)];
    saveStoredProducts(updatedLocal);

    // 2. Insert into central Supabase Cloud Database (for global sync across all devices/browsers)
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([cleanPayload])
          .select()
          .single();

        if (!error && data) {
          createdProduct = data as Product;
          // Sync local cache with official Supabase database record
          const syncLocal = [createdProduct, ...currentLocal.filter(p => p.slug !== createdProduct.slug)];
          saveStoredProducts(syncLocal);
          console.log('✅ Producto guardado exitosamente en la nube Supabase:', createdProduct.name);
        } else if (error) {
          console.warn('⚠️ Supabase no permitió guardar en la nube (se guardó en este navegador local):', error.message);
          // If RLS or missing schema error, raise notice
          if (error.message.includes('row-level security') || error.message.includes('policy')) {
            console.error('🔒 Ejecutar políticas de seguridad RLS en el editor SQL de Supabase.');
          }
        }
      } catch (err) {
        console.error('Supabase exception, saved locally:', err);
      }
    }

    return createdProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const currentLocal = getStoredProducts();
    const index = currentLocal.findIndex(p => p.id === id || p.slug === updates.slug);

    let updatedProduct: Product | null = null;

    if (index !== -1) {
      updatedProduct = { ...currentLocal[index], ...updates };
      currentLocal[index] = updatedProduct;
      saveStoredProducts([...currentLocal]);
    }

    // Clean payload for Supabase update
    const cleanUpdates: any = { ...updates };
    if (cleanUpdates.original_price === undefined) {
      delete cleanUpdates.original_price;
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(cleanUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          updatedProduct = data as Product;
          if (index !== -1) {
            currentLocal[index] = updatedProduct;
            saveStoredProducts([...currentLocal]);
          }
        } else if (error) {
          console.warn('Supabase update warning, saved locally:', error.message);
        }
      } catch (err) {
        console.error('Supabase update exception:', err);
      }
    }

    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    // 1. Update local storage first
    const currentLocal = getStoredProducts();
    const filtered = currentLocal.filter(p => p.id !== id);
    saveStoredProducts(filtered);

    // 2. Sync with Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete exception:', err);
      }
    }

    return true;
  }
};
