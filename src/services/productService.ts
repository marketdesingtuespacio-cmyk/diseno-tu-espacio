import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, ProductFilterState } from '../types';
import { MOCK_PRODUCTS } from './mockData';
import { activityLogService } from './activityLogService';

const LOCAL_STORAGE_DELETED_PRODUCTS_KEY = 'luxe_deleted_products_v1';

// Purge any legacy oversized product catalog cache keys from localStorage to prevent QuotaExceededError
export const clearLegacyProductLocalStorage = () => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('luxe_products') || key.startsWith('luxe_catalog') || key.includes('products_v'))) {
        if (key !== LOCAL_STORAGE_DELETED_PRODUCTS_KEY) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Error clearing legacy product localStorage keys:', err);
  }
};

// Immediately execute on module load to free up browser storage
clearLegacyProductLocalStorage();

export const getDeletedProductKeys = (): Set<string> => {
  const stored = localStorage.getItem(LOCAL_STORAGE_DELETED_PRODUCTS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map((s: string) => String(s).toLowerCase().trim()));
      }
    } catch {
      // fallback
    }
  }
  return new Set();
};

export const saveDeletedProductKeys = (keys: Set<string>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify(Array.from(keys)));
  } catch (err) {
    console.warn('Error saving deleted product keys:', err);
  }
};

export const addDeletedProductKey = (...keys: (string | undefined)[]) => {
  const current = getDeletedProductKeys();
  keys.forEach(k => {
    if (k && k.trim().length > 0) {
      current.add(k.toLowerCase().trim());
    }
  });
  saveDeletedProductKeys(current);
};

export const removeDeletedProductKey = (...keys: (string | undefined)[]) => {
  const current = getDeletedProductKeys();
  keys.forEach(k => {
    if (k && k.trim().length > 0) {
      current.delete(k.toLowerCase().trim());
    }
  });
  saveDeletedProductKeys(current);
};

export const isProductDeleted = (p: { id?: string; slug?: string; sku?: string; name?: string }, deletedSet?: Set<string>): boolean => {
  const set = deletedSet || getDeletedProductKeys();
  if (!set || set.size === 0) return false;
  if (p.id && set.has(p.id.toLowerCase().trim())) return true;
  if (p.slug && set.has(p.slug.toLowerCase().trim())) return true;
  if (p.sku && set.has(p.sku.toLowerCase().trim())) return true;
  if (p.name && set.has(p.name.toLowerCase().trim())) return true;
  return false;
};

const getStoredProducts = (): Product[] => {
  const deletedSet = getDeletedProductKeys();
  if (memoryProductsCache && memoryProductsCache.length > 0) {
    return memoryProductsCache.filter(p => !isProductDeleted(p, deletedSet));
  }
  return MOCK_PRODUCTS.filter(p => !isProductDeleted(p, deletedSet));
};

const saveStoredProducts = (products: Product[]) => {
  const deletedSet = getDeletedProductKeys();
  const clean = products.filter(p => !isProductDeleted(p, deletedSet));
  memoryProductsCache = clean;
  clearLegacyProductLocalStorage();
};

export const isCategoryMatch = (prodCat?: string, filterCat?: string): boolean => {
  if (!filterCat || filterCat === 'all') return true;
  if (!prodCat) return false;

  const p = prodCat.toLowerCase().trim();
  const f = filterCat.toLowerCase().trim();

  if (p === f) return true;

  // Normalize Cuadros variations (Cuadros, Cuadros & Espejos, Cuadros y Espejos)
  const isCuadrosFilter = f === 'cuadros' || f.includes('cuadro');
  const isCuadrosProd = p === 'cuadros' || p.includes('cuadro');

  if (isCuadrosFilter && isCuadrosProd) return true;

  // Normalize Espejos variations
  const isEspejosFilter = f === 'espejos' || f.includes('espejo');
  const isEspejosProd = p === 'espejos' || p.includes('espejo');

  if (isEspejosFilter && isEspejosProd) return true;

  return false;
};

const enrichProduct = (p: Product, localLookupMap?: Map<string, Product>): Product => {
  // If product comes from database/memory, strictly preserve its authoritative attributes
  const isFromSupabaseOrCache = Boolean(p.id && (p.created_at || p.updated_at || p.price !== undefined));

  let fallback: Product | undefined;
  if (!isFromSupabaseOrCache) {
    if (localLookupMap) {
      if (p.id) fallback = localLookupMap.get(p.id);
      if (!fallback && p.slug) fallback = localLookupMap.get(p.slug);
      if (!fallback && p.sku) fallback = localLookupMap.get(p.sku.toLowerCase());
      if (!fallback && p.name) fallback = localLookupMap.get(p.name.toLowerCase());
    }

    if (!fallback) {
      fallback = MOCK_PRODUCTS.find(m => 
        (p.id && m.id === p.id) || 
        (p.slug && m.slug === p.slug) || 
        (p.sku && m.sku && m.sku.toLowerCase() === p.sku.toLowerCase()) || 
        (p.name && m.name.toLowerCase() === p.name.toLowerCase())
      );
    }
  }

  const resolvedStatus = (p.inventory_status && p.inventory_status.trim().length > 0)
    ? p.inventory_status
    : (fallback?.inventory_status || (p.stock > 0 ? 'Disponible' : 'Agotado'));

  const resolvedWholesalePrice = p.wholesale_price !== undefined && p.wholesale_price !== null && Number(p.wholesale_price) > 0
    ? Number(p.wholesale_price)
    : (fallback?.wholesale_price && Number(fallback.wholesale_price) > 0 ? Number(fallback.wholesale_price) : null);

  const resolvedWholesaleMinQty = p.wholesale_min_qty !== undefined && p.wholesale_min_qty !== null
    ? Number(p.wholesale_min_qty)
    : (fallback?.wholesale_min_qty ? Number(fallback.wholesale_min_qty) : (p.boxes_count && p.boxes_count > 0 ? p.boxes_count : 5));

  const resolvedImages = (p.images && p.images.length > 0)
    ? p.images
    : (fallback?.images && fallback.images.length > 0 ? fallback.images : []);

  const resolvedColors = p.colors !== undefined 
    ? p.colors 
    : (fallback?.colors || []);

  const resolvedUpdatedAt = p.updated_at || fallback?.updated_at || p.created_at || new Date().toISOString();
  const activeUser = activityLogService.getCurrentUser ? activityLogService.getCurrentUser() : null;
  const activeUserLabel = activeUser ? `${activeUser.name} (${activeUser.email})` : 'Administración';
  const resolvedUpdatedBy = p.updated_by || fallback?.updated_by || activeUserLabel;

  return {
    ...(fallback || {}),
    ...p,
    images: resolvedImages,
    colors: resolvedColors,
    sku: (p.sku && p.sku.trim().length > 0) ? p.sku : (fallback?.sku || ''),
    warehouse_stock: p.warehouse_stock !== undefined ? p.warehouse_stock : (fallback?.warehouse_stock ?? 0),
    store_stock: p.store_stock !== undefined ? p.store_stock : (fallback?.store_stock ?? 0),
    web_stock: p.web_stock !== undefined ? p.web_stock : (fallback?.web_stock ?? p.stock),
    boxes_count: p.boxes_count !== undefined ? p.boxes_count : (fallback?.boxes_count ?? 0),
    warranty: (p.warranty && p.warranty.trim().length > 0) ? p.warranty : (fallback?.warranty || '3 años'),
    inventory_status: resolvedStatus,
    wholesale_price: resolvedWholesalePrice,
    wholesale_min_qty: resolvedWholesaleMinQty,
    updated_at: resolvedUpdatedAt,
    updated_by: resolvedUpdatedBy
  };
};

let memoryProductsCache: Product[] | null = null;
let productsFetchPromise: Promise<Product[]> | null = null;
let isProductRealtimeSubscribed = false;

export const clearProductCache = () => {
  memoryProductsCache = null;
  productsFetchPromise = null;
};

export const notifyProductsUpdated = () => {
  clearProductCache();
  window.dispatchEvent(new Event('products_updated'));
};

export const subscribeToProducts = (callback: () => void): (() => void) => {
  const handleEvent = () => callback();
  window.addEventListener('products_updated', handleEvent);

  if (isSupabaseConfigured() && !isProductRealtimeSubscribed) {
    isProductRealtimeSubscribed = true;
    try {
      supabase
        .channel('public_products_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          clearProductCache();
          window.dispatchEvent(new Event('products_updated'));
        })
        .subscribe();
    } catch (err) {
      console.warn('Supabase Realtime subscription warning for products:', err);
    }
  }

  return () => {
    window.removeEventListener('products_updated', handleEvent);
  };
};

const applyProductFilters = (products: Product[], filters?: Partial<ProductFilterState>, includePrivate: boolean = false): Product[] => {
  let result = [...products];

  if (!includePrivate) {
    result = result.filter(p => p.inventory_status !== 'Privado');
  }

  if (filters) {
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => isCategoryMatch(p.category, filters.category));
    }
    if (filters.style && filters.style !== 'all') {
      result = result.filter(p => p.style === filters.style);
    }
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0 && p.inventory_status !== 'Agotado');
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
        (p.sku && p.sku.toLowerCase().includes(q)) ||
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
};

export const productService = {
  getProductsSync(filters?: Partial<ProductFilterState>, includePrivate: boolean = true): Product[] {
    const base = memoryProductsCache || getStoredProducts() || MOCK_PRODUCTS;
    const localLookupMap = new Map<string, Product>();
    base.forEach(p => {
      if (p.id) localLookupMap.set(p.id, p);
      if (p.slug) localLookupMap.set(p.slug, p);
      if (p.sku) localLookupMap.set(p.sku.toLowerCase(), p);
      if (p.name) localLookupMap.set(p.name.toLowerCase(), p);
    });
    const enriched = base.map(p => enrichProduct(p, localLookupMap));
    return applyProductFilters(enriched, filters, includePrivate);
  },

  getProductBySlugSync(slug: string, includePrivate: boolean = true): Product | null {
    const products = this.getProductsSync(undefined, includePrivate);
    const target = (slug || '').toLowerCase().trim();
    const found = products.find(p => 
      (p.slug && p.slug.toLowerCase().trim() === target) || 
      (p.id && p.id.toLowerCase().trim() === target) || 
      (p.sku && p.sku.toLowerCase().trim() === target)
    );
    return found || null;
  },

  async getProducts(filters?: Partial<ProductFilterState>, includePrivate: boolean = false, forceRefresh: boolean = false): Promise<Product[]> {
    if (memoryProductsCache && !forceRefresh) {
      return applyProductFilters(memoryProductsCache, filters, includePrivate);
    }

    if (productsFetchPromise && !forceRefresh) {
      const fetched = await productsFetchPromise;
      return applyProductFilters(fetched, filters, includePrivate);
    }

    productsFetchPromise = (async () => {
      const deletedSet = getDeletedProductKeys();
      let localProducts = getStoredProducts().filter(p => !isProductDeleted(p, deletedSet));

      const localLookupMap = new Map<string, Product>();
      localProducts.forEach(p => {
        if (p.id) localLookupMap.set(p.id, p);
        if (p.slug) localLookupMap.set(p.slug, p);
        if (p.sku) localLookupMap.set(p.sku.toLowerCase(), p);
        if (p.name) localLookupMap.set(p.name.toLowerCase(), p);
      });

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data && data.length > 0) {
            const supabaseProducts = (data as Product[]).filter(sp => !isProductDeleted(sp, deletedSet));
            const supabaseMap = new Map<string, Product>();
            supabaseProducts.forEach(sp => {
              if (sp.slug) supabaseMap.set(sp.slug, sp);
              if (sp.id) supabaseMap.set(sp.id, sp);
              if (sp.sku) supabaseMap.set(sp.sku.toLowerCase(), sp);
            });

            // Merge: Preserve active items and overlay Supabase updates (skip deleted)
            const validMockProducts = MOCK_PRODUCTS.filter(m => !isProductDeleted(m, deletedSet));
            const mergedProducts = validMockProducts.map(baseProd => {
              const sp = supabaseMap.get(baseProd.slug) || 
                         supabaseMap.get(baseProd.id) || 
                         (baseProd.sku ? supabaseMap.get(baseProd.sku.toLowerCase()) : undefined);
              if (sp) {
                return enrichProduct({ ...baseProd, ...sp }, localLookupMap);
              }
              return enrichProduct(baseProd, localLookupMap);
            });

            // Include any newly added Supabase products not in MOCK_PRODUCTS
            supabaseProducts.forEach(sp => {
              const exists = mergedProducts.some(mp => 
                mp.id === sp.id || 
                mp.slug === sp.slug || 
                (mp.sku && sp.sku && mp.sku.toLowerCase() === sp.sku.toLowerCase())
              );
              if (!exists) {
                mergedProducts.push(enrichProduct(sp, localLookupMap));
              }
            });

            const cleanMerged = mergedProducts.filter(p => !isProductDeleted(p, deletedSet));
            saveStoredProducts(cleanMerged);
            localProducts = cleanMerged;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, using local product dataset', err);
        }
      }

      const finalEnriched = localProducts
        .filter(p => !isProductDeleted(p, deletedSet))
        .map(p => enrichProduct(p, localLookupMap));
      memoryProductsCache = finalEnriched;
      productsFetchPromise = null;
      return finalEnriched;
    })();

    const resultProducts = await productsFetchPromise;
    return applyProductFilters(resultProducts, filters, includePrivate);
  },

  async getProductBySlug(slug: string, includePrivate: boolean = true): Promise<Product | null> {
    const syncResult = this.getProductBySlugSync(slug, includePrivate);
    if (syncResult) {
      // Trigger background update if cache isn't populated yet
      if (!memoryProductsCache) {
        this.getProducts(undefined, includePrivate).catch(() => {});
      }
      return syncResult;
    }

    const products = await this.getProducts(undefined, includePrivate);
    const target = (slug || '').toLowerCase().trim();
    const found = products.find(p => 
      (p.slug && p.slug.toLowerCase().trim() === target) || 
      (p.id && p.id.toLowerCase().trim() === target) || 
      (p.sku && p.sku.toLowerCase().trim() === target)
    );
    return found || null;
  },

  async uploadProductImage(fileInput: File | Blob | string, customFileName?: string): Promise<string> {
    if (typeof fileInput === 'string' && !fileInput.startsWith('data:image/')) {
      return fileInput;
    }

    if (!isSupabaseConfigured()) {
      return typeof fileInput === 'string' ? fileInput : URL.createObjectURL(fileInput);
    }

    try {
      let fileBody: File | Blob;
      let extension = 'jpg';

      if (typeof fileInput === 'string' && fileInput.startsWith('data:image/')) {
        const match = fileInput.match(/^data:(image\/\w+);base64,/);
        const mimeType = match ? match[1] : 'image/jpeg';
        extension = mimeType.split('/')[1] || 'jpg';
        const base64Data = fileInput.replace(/^data:image\/\w+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        fileBody = new Blob([byteArray], { type: mimeType });
      } else if (fileInput instanceof File || fileInput instanceof Blob) {
        fileBody = fileInput;
        if (fileInput instanceof File && fileInput.name) {
          const ext = fileInput.name.split('.').pop();
          if (ext) extension = ext.toLowerCase();
        }
      } else {
        return typeof fileInput === 'string' ? fileInput : '';
      }

      const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().substring(0, 8) : Math.floor(Math.random() * 100000);
      const fileName = customFileName 
        ? `${customFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${extension}`
        : `prod_${Date.now()}_${uniqueId}.${extension}`;

      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, fileBody, {
          contentType: fileBody.type || `image/${extension}`,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadErr) {
        console.warn('⚠️ Supabase Storage warning on image upload:', uploadErr.message);
        return typeof fileInput === 'string' ? fileInput : URL.createObjectURL(fileInput);
      }

      if (uploadData?.path) {
        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        if (publicData?.publicUrl) {
          console.log('✅ Imagen subida exitosamente a Supabase Storage:', publicData.publicUrl);
          return publicData.publicUrl;
        }
      }
    } catch (err) {
      console.error('Excepción al subir imagen a Supabase Storage:', err);
    }

    return typeof fileInput === 'string' ? fileInput : URL.createObjectURL(fileInput);
  },

  async uploadMultipleProductImages(images: (File | Blob | string)[]): Promise<string[]> {
    if (!images || images.length === 0) return [];
    const uploadedUrls: string[] = [];

    for (const img of images) {
      const url = await this.uploadProductImage(img);
      if (url) uploadedUrls.push(url);
    }

    return uploadedUrls;
  },

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const generatedId = `prod-${Date.now()}`;
    const activeUser = activityLogService.getCurrentUser();
    const nowISO = new Date().toISOString();
    const userLabel = `${activeUser.name} (${activeUser.email})`;

    // Upload base64 or File images to Supabase Storage and resolve permanent public URLs
    let finalImages: string[] = productData.images || [];
    if (finalImages.some(img => typeof img === 'string' && img.startsWith('data:image/'))) {
      finalImages = await this.uploadMultipleProductImages(finalImages);
    }
    
    // Clean payload for Supabase insertion with full inventory columns
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
      images: finalImages,
      colors: productData.colors || [],
      is_featured: !!productData.is_featured,
      dimensions: productData.dimensions || '',
      materials: productData.materials || '',
      sku: productData.sku || '',
      warehouse_stock: Number(productData.warehouse_stock || 0),
      store_stock: Number(productData.store_stock || 0),
      web_stock: Number(productData.web_stock || 0),
      boxes_count: Number(productData.boxes_count || 0),
      warranty: productData.warranty || '3 años',
      inventory_status: productData.inventory_status || 'Disponible',
      wholesale_price: productData.wholesale_price !== undefined && productData.wholesale_price !== null && Number(productData.wholesale_price) > 0 ? Number(productData.wholesale_price) : null,
      wholesale_min_qty: Number(productData.wholesale_min_qty || productData.boxes_count || 5),
      updated_at: nowISO,
      updated_by: userLabel
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
        let { data, error } = await supabase
          .from('products')
          .insert([cleanPayload])
          .select()
          .single();

        if (error && (error.message.includes('updated_at') || error.message.includes('updated_by') || error.message.includes('wholesale_price') || error.message.includes('wholesale_min_qty') || error.message.includes('column'))) {
          const { updated_at, updated_by, wholesale_price, wholesale_min_qty, ...fallbackPayload } = cleanPayload;
          const retryRes = await supabase.from('products').insert([fallbackPayload]).select().single();
          data = retryRes.data;
          error = retryRes.error;
        }

        if (!error && data) {
          createdProduct = enrichProduct({ ...productData, ...(data as Product) });
          const syncLocal = [createdProduct, ...currentLocal.filter(p => p.slug !== createdProduct.slug)];
          saveStoredProducts(syncLocal);
          console.log('✅ Producto guardado exitosamente en la nube Supabase:', createdProduct.name);
        } else if (error) {
          console.warn('⚠️ Supabase no permitió guardar en la nube (se guardó en este navegador local):', error.message);
        }
      } catch (err) {
        console.error('Supabase exception, saved locally:', err);
      }
    }

    activityLogService.logActivity({
      entity_type: 'product',
      entity_id: createdProduct.id,
      entity_name: createdProduct.name,
      action: 'create',
      description: `Registró el nuevo producto "${createdProduct.name}"`,
      details: `SKU: ${createdProduct.sku || createdProduct.id} | Categoría: ${createdProduct.category} | Precio: $${createdProduct.price.toLocaleString('es-CO')} COP | Stock: ${createdProduct.stock} u.`
    });

    notifyProductsUpdated();
    return createdProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const currentLocal = getStoredProducts();
    let index = currentLocal.findIndex(p => 
      p.id === id || 
      p.slug === id || 
      (p.sku && p.sku.toLowerCase() === id.toLowerCase()) || 
      (updates.slug && p.slug === updates.slug) ||
      (updates.sku && p.sku && p.sku.toLowerCase() === updates.sku.toLowerCase()) ||
      (updates.name && p.name.toLowerCase() === updates.name.toLowerCase())
    );

    let updatedProduct: Product | null = null;

    if (index !== -1) {
      updatedProduct = enrichProduct({ ...currentLocal[index], ...updates });
      currentLocal[index] = updatedProduct;
      saveStoredProducts([...currentLocal]);
    } else {
      const mockMatch = MOCK_PRODUCTS.find(p => 
        p.id === id || 
        p.slug === id || 
        (p.sku && p.sku.toLowerCase() === id.toLowerCase())
      );
      if (mockMatch) {
        updatedProduct = enrichProduct({ ...mockMatch, ...updates });
        currentLocal.unshift(updatedProduct);
        saveStoredProducts([...currentLocal]);
        index = 0;
      }
    }

    const activeUser = activityLogService.getCurrentUser();
    const nowISO = new Date().toISOString();
    const userLabel = `${activeUser.name} (${activeUser.email})`;

    // Upload any base64 or File images to Supabase Storage
    let finalImages: string[] | undefined = updates.images;
    if (finalImages && finalImages.some(img => typeof img === 'string' && img.startsWith('data:image/'))) {
      finalImages = await this.uploadMultipleProductImages(finalImages);
    }

    // Strict clean payload with all supported Supabase columns
    const cleanPayload: any = {
      updated_at: nowISO,
      updated_by: userLabel
    };
    if (updates.name !== undefined) cleanPayload.name = updates.name;
    if (updates.slug !== undefined) cleanPayload.slug = updates.slug;
    if (updates.brand_collection !== undefined) cleanPayload.brand_collection = updates.brand_collection;
    if (updates.description !== undefined) cleanPayload.description = updates.description;
    if (updates.price !== undefined) cleanPayload.price = Number(updates.price);
    if (updates.original_price !== undefined) cleanPayload.original_price = updates.original_price ? Number(updates.original_price) : null;
    if (updates.category !== undefined) cleanPayload.category = updates.category;
    if (updates.style !== undefined) cleanPayload.style = updates.style;
    if (updates.stock !== undefined) cleanPayload.stock = Number(updates.stock);
    if (finalImages !== undefined) cleanPayload.images = finalImages;
    if (updates.colors !== undefined) cleanPayload.colors = updates.colors;
    if (updates.is_featured !== undefined) cleanPayload.is_featured = !!updates.is_featured;
    if (updates.dimensions !== undefined) cleanPayload.dimensions = updates.dimensions;
    if (updates.materials !== undefined) cleanPayload.materials = updates.materials;
    if (updates.sku !== undefined) cleanPayload.sku = updates.sku;
    if (updates.warehouse_stock !== undefined) cleanPayload.warehouse_stock = Number(updates.warehouse_stock);
    if (updates.store_stock !== undefined) cleanPayload.store_stock = Number(updates.store_stock);
    if (updates.web_stock !== undefined) cleanPayload.web_stock = Number(updates.web_stock);
    if (updates.boxes_count !== undefined) cleanPayload.boxes_count = Number(updates.boxes_count);
    if (updates.warranty !== undefined) cleanPayload.warranty = updates.warranty;
    if (updates.inventory_status !== undefined) cleanPayload.inventory_status = updates.inventory_status;
    if (updates.wholesale_price !== undefined) cleanPayload.wholesale_price = updates.wholesale_price ? Number(updates.wholesale_price) : null;
    if (updates.wholesale_min_qty !== undefined) cleanPayload.wholesale_min_qty = Number(updates.wholesale_min_qty);

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
          updatedProduct = enrichProduct({ ...(updatedProduct || {}), ...synced });
          if (index !== -1 && updatedProduct) {
            currentLocal[index] = updatedProduct;
            saveStoredProducts([...currentLocal]);
          }
          console.log('✅ Producto actualizado exitosamente en Supabase Nube:', updatedProduct.name);
        } else {
          // If record does not exist in Supabase yet, insert it automatically
          const baseProd = index !== -1 ? currentLocal[index] : null;
          const fullInsertPayload = {
            name: updates.name || baseProd?.name || 'Nuevo Producto',
            slug: updates.slug || baseProd?.slug || `prod-${Date.now()}`,
            brand_collection: updates.brand_collection || baseProd?.brand_collection || 'Diseño Tu Espacio Collection',
            description: updates.description || baseProd?.description || '',
            price: Number(updates.price !== undefined ? updates.price : (baseProd?.price || 0)),
            original_price: updates.original_price !== undefined ? (updates.original_price ? Number(updates.original_price) : null) : (baseProd?.original_price || null),
            category: updates.category || baseProd?.category || 'Varios',
            style: updates.style || baseProd?.style || 'Contemporáneo',
            stock: Number(updates.stock !== undefined ? updates.stock : (baseProd?.stock || 0)),
            images: updates.images || baseProd?.images || [],
            colors: updates.colors || baseProd?.colors || [],
            is_featured: updates.is_featured !== undefined ? !!updates.is_featured : !!baseProd?.is_featured,
            dimensions: updates.dimensions || baseProd?.dimensions || '',
            materials: updates.materials || baseProd?.materials || '',
            sku: updates.sku || baseProd?.sku || '',
            warehouse_stock: Number(updates.warehouse_stock !== undefined ? updates.warehouse_stock : (baseProd?.warehouse_stock || 0)),
            store_stock: Number(updates.store_stock !== undefined ? updates.store_stock : (baseProd?.store_stock || 0)),
            web_stock: Number(updates.web_stock !== undefined ? updates.web_stock : (baseProd?.web_stock || 0)),
            boxes_count: Number(updates.boxes_count !== undefined ? updates.boxes_count : (baseProd?.boxes_count || 0)),
            warranty: updates.warranty || baseProd?.warranty || '3 años',
            inventory_status: updates.inventory_status || baseProd?.inventory_status || 'Disponible',
            wholesale_price: updates.wholesale_price !== undefined ? (updates.wholesale_price ? Number(updates.wholesale_price) : null) : (baseProd?.wholesale_price ? Number(baseProd.wholesale_price) : null),
            wholesale_min_qty: Number(updates.wholesale_min_qty !== undefined ? updates.wholesale_min_qty : (baseProd?.wholesale_min_qty || baseProd?.boxes_count || 5))
          };
          let { data: insertedData, error: insertError } = await supabase.from('products').insert([fullInsertPayload]).select();
          if (insertError && (insertError.message.includes('wholesale_price') || insertError.message.includes('wholesale_min_qty') || insertError.message.includes('column'))) {
            const { wholesale_price, wholesale_min_qty, ...fallbackPayload } = fullInsertPayload;
            const retryRes = await supabase.from('products').insert([fallbackPayload]).select();
            insertedData = retryRes.data;
          }
          if (insertedData && insertedData.length > 0) {
            console.log('✅ Producto insertado exitosamente en Supabase Nube:', insertedData[0].name);
          }
        }
      } catch (err) {
        console.error('Supabase update exception:', err);
      }
    }

    const prodName = updates.name || (updatedProduct?.name) || id;
    activityLogService.logActivity({
      entity_type: 'product',
      entity_id: id,
      entity_name: prodName,
      action: updates.inventory_status ? 'status_change' : 'update',
      description: updates.inventory_status 
        ? `Cambió el estado a "${updates.inventory_status}" en el producto "${prodName}"`
        : `Actualizó datos del producto "${prodName}"`,
      details: `Campos modificados: ${Object.keys(updates).join(', ')}`
    });

    notifyProductsUpdated();
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    clearProductCache();
    const target = (id || '').toLowerCase().trim();

    // 1. Update local storage & permanently track deleted keys
    const currentLocal = getStoredProducts();
    const targetProd = currentLocal.find(p => 
      p.id === id || 
      (p.slug && p.slug.toLowerCase().trim() === target) || 
      (p.sku && p.sku.toLowerCase().trim() === target) ||
      (p.name && p.name.toLowerCase().trim() === target)
    );

    addDeletedProductKey(id, targetProd?.slug, targetProd?.sku, targetProd?.name);

    const filtered = currentLocal.filter(p => 
      p.id !== id && 
      (!p.slug || p.slug.toLowerCase().trim() !== target) && 
      (!p.sku || p.sku.toLowerCase().trim() !== target) &&
      (!p.name || p.name.toLowerCase().trim() !== target)
    );
    saveStoredProducts(filtered);

    // 2. Sync with Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('products').delete().eq('id', id);
        if (targetProd?.slug) {
          await supabase.from('products').delete().eq('slug', targetProd.slug);
        }
        if (targetProd?.id && targetProd.id !== id) {
          await supabase.from('products').delete().eq('id', targetProd.id);
        }
        if (targetProd?.sku) {
          await supabase.from('products').delete().eq('sku', targetProd.sku);
        }
      } catch (err) {
        console.error('Supabase delete exception:', err);
      }
    }

    activityLogService.logActivity({
      entity_type: 'product',
      entity_id: id,
      entity_name: targetProd?.name || id,
      action: 'delete',
      description: `Eliminó el producto "${targetProd?.name || id}" del catálogo`,
      details: `ID/SKU: ${targetProd?.sku || id}`
    });

    notifyProductsUpdated();
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
  },

  async syncAllToSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, count: 0, message: 'Supabase no está configurado en las variables de entorno.' };
    }

    try {
      // Unidirectional Single Source of Truth: Fetch canonical records from Supabase PostgreSQL
      const { data: dbProducts, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (error) {
        return { success: false, count: 0, message: `Error al consultar Supabase Nube: ${error.message}` };
      }

      if (dbProducts && dbProducts.length > 0) {
        saveStoredProducts(dbProducts as Product[]);
        clearProductCache();
        notifyProductsUpdated();
      }

      return {
        success: true,
        count: dbProducts?.length || 0,
        message: `¡Caché de cliente actualizada! Se sincronizaron exitosamente ${dbProducts?.length || 0} productos desde Supabase Nube (Fuente Única de Verdad).`
      };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        message: `Excepción al refrescar desde Supabase: ${err?.message || 'Error desconocido'}`
      };
    }
  }
};
