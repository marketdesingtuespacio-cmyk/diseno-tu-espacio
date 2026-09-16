import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, ProductFilterState } from '../types';
import { MOCK_PRODUCTS } from './mockData';

const LOCAL_STORAGE_PRODUCTS_KEY = 'luxe_products_v10';

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
    console.warn('localStorage quota warning:', err);
    try {
      // Save products preserving all user images
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // Storage safety
    }
  }
};

export const productService = {
  async getProducts(filters?: Partial<ProductFilterState>, includePrivate: boolean = false): Promise<Product[]> {
    let localProducts = getStoredProducts();

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('products').select('*');

        if (!includePrivate) {
          query = query.neq('inventory_status', 'Privado');
        }

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

    // Filter out Private products for public consumers
    if (!includePrivate) {
      result = result.filter(p => p.inventory_status !== 'Privado');
    }

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

  async getProductBySlug(slug: string, includePrivate: boolean = false): Promise<Product | null> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('slug', slug);
        if (!includePrivate) {
          query = query.neq('inventory_status', 'Privado');
        }
        const { data, error } = await query.single();
        if (!error && data) return data as Product;
      } catch {
        // fallback
      }
    }
    const products = getStoredProducts();
    const found = products.find(p => p.slug === slug);
    if (found && !includePrivate && found.inventory_status === 'Privado') {
      return null;
    }
    return found || null;
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
    const index = currentLocal.findIndex(p => p.id === id || (updates.slug && p.slug === updates.slug));

    let updatedProduct: Product | null = null;

    if (index !== -1) {
      updatedProduct = { ...currentLocal[index], ...updates };
      currentLocal[index] = updatedProduct;
      saveStoredProducts([...currentLocal]);
    }

    // Strict clean payload with only supported Supabase columns
    const cleanPayload: any = {};
    if (updates.name !== undefined) cleanPayload.name = updates.name;
    if (updates.slug !== undefined) cleanPayload.slug = updates.slug;
    if (updates.brand_collection !== undefined) cleanPayload.brand_collection = updates.brand_collection;
    if (updates.description !== undefined) cleanPayload.description = updates.description;
    if (updates.price !== undefined) cleanPayload.price = Number(updates.price);
    if (updates.original_price !== undefined) cleanPayload.original_price = updates.original_price ? Number(updates.original_price) : null;
    if (updates.category !== undefined) cleanPayload.category = updates.category;
    if (updates.style !== undefined) cleanPayload.style = updates.style;
    if (updates.stock !== undefined) cleanPayload.stock = Number(updates.stock);
    if (updates.images !== undefined) cleanPayload.images = updates.images;
    if (updates.colors !== undefined) cleanPayload.colors = updates.colors;
    if (updates.is_featured !== undefined) cleanPayload.is_featured = !!updates.is_featured;
    if (updates.dimensions !== undefined) cleanPayload.dimensions = updates.dimensions;
    if (updates.materials !== undefined) cleanPayload.materials = updates.materials;

    if (isSupabaseConfigured()) {
      try {
        const targetSlug = updates.slug || (index !== -1 ? currentLocal[index].slug : undefined);
        const isUUID = id && id.length > 20 && !id.startsWith('prod-') && !id.startsWith('real-') && !id.startsWith('w-');

        let query = supabase.from('products').update(cleanPayload);
        if (isUUID) {
          query = query.eq('id', id);
        } else if (targetSlug) {
          query = query.eq('slug', targetSlug);
        }

        const { data, error } = await query.select();

        if (!error && data && data.length > 0) {
          const synced = data[0] as Product;
          updatedProduct = { ...updatedProduct, ...synced };
          if (index !== -1) {
            currentLocal[index] = updatedProduct;
            saveStoredProducts([...currentLocal]);
          }
          console.log('✅ Producto actualizado exitosamente en Supabase Nube:', updatedProduct.name);
        } else {
          // If record does not exist in Supabase yet, insert it automatically
          const fullInsertPayload = {
            name: updates.name || (index !== -1 ? currentLocal[index].name : 'Nuevo Producto'),
            slug: updates.slug || (index !== -1 ? currentLocal[index].slug : `prod-${Date.now()}`),
            brand_collection: updates.brand_collection || 'Diseño Tu Espacio Collection',
            description: updates.description || '',
            price: Number(updates.price || 0),
            original_price: updates.original_price ? Number(updates.original_price) : null,
            category: updates.category || 'Varios',
            style: updates.style || 'Contemporáneo',
            stock: Number(updates.stock || 0),
            images: updates.images || (index !== -1 ? currentLocal[index].images : []),
            colors: updates.colors || [],
            is_featured: !!updates.is_featured,
            dimensions: updates.dimensions || '',
            materials: updates.materials || ''
          };
          const { data: insertedData } = await supabase.from('products').insert([fullInsertPayload]).select();
          if (insertedData && insertedData.length > 0) {
            console.log('✅ Producto insertado exitosamente en Supabase Nube:', insertedData[0].name);
          }
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
  },

  async deductStockForItems(items: { product_id: string; quantity: number }[]): Promise<void> {
    if (!items || items.length === 0) return;

    const products = getStoredProducts();
    let updatedAny = false;

    for (const item of items) {
      const idx = products.findIndex(p => p.id === item.product_id || p.slug === item.product_id);
      if (idx !== -1) {
        const prod = products[idx];
        const qty = item.quantity || 1;
        const newStock = Math.max(0, prod.stock - qty);
        const currentWebStock = prod.web_stock !== undefined ? prod.web_stock : prod.stock;
        const newWebStock = Math.max(0, currentWebStock - qty);

        let newStatus = prod.inventory_status || 'Disponible';
        if (newStock <= 0) {
          newStatus = 'Agotado';
        } else if (newStock <= 3) {
          newStatus = 'Poco Stock';
        } else {
          newStatus = 'Disponible';
        }

        const updatedProd: Product = {
          ...prod,
          stock: newStock,
          web_stock: newWebStock,
          inventory_status: newStatus
        };

        products[idx] = updatedProd;
        updatedAny = true;

        if (isSupabaseConfigured()) {
          try {
            await supabase
              .from('products')
              .update({ stock: newStock, web_stock: newWebStock, inventory_status: newStatus })
              .eq('id', prod.id);
          } catch (err) {
            console.warn('Supabase stock deduction error:', err);
          }
        }
      }
    }

    if (updatedAny) {
      saveStoredProducts(products);
    }
  }
};
