import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown, RefreshCw, Search } from 'lucide-react';
import { Product, ProductFilterState } from '../types';
import { productService, subscribeToProducts } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { useCurrency } from '../context/CurrencyContext';

const DEFAULT_CATEGORIES = ['all', 'Espejos', 'Papel de Colgadura', 'Lavamanos', 'Cuadros', 'Revestimientos'];
const STYLES = ['all', 'Minimalista', 'Contemporáneo', 'Bauhaus', 'Nórdico', 'Orgánico Moderno', 'Galería Contemporánea', 'Arquitectónico'];
const DEFAULT_MAX_PRICE = 20000000; // $20.000.000 COP default max threshold

const cleanAndDedupeCategories = (rawList: string[]): string[] => {
  const map = new Map<string, string>();
  rawList.forEach(c => {
    if (!c) return;
    const trimmed = c.trim();
    if (!trimmed) return;
    let canonical = trimmed;
    if (trimmed.toLowerCase() === 'papel de colgadura') canonical = 'Papel de Colgadura';
    else if (trimmed.toLowerCase() === 'espejos') canonical = 'Espejos';
    else if (trimmed.toLowerCase() === 'lavamanos') canonical = 'Lavamanos';
    else if (trimmed.toLowerCase() === 'cuadros') canonical = 'Cuadros';
    else if (trimmed.toLowerCase() === 'revestimientos') canonical = 'Revestimientos';

    const key = canonical.toLowerCase();
    if (!map.has(key)) {
      map.set(key, canonical);
    }
  });
  return Array.from(map.values());
};

export const CatalogPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock body scroll on mobile when filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Fetch dynamic categories from active public products & deduplicate case variants
  useEffect(() => {
    const cached = productService.getProductsSync();
    if (cached.length > 0) {
      const activeCats = cleanAndDedupeCategories(cached.map(p => p.category).filter(Boolean));
      if (activeCats.length > 0) setCategories(['all', ...activeCats]);
    }
    productService.getProducts().then(publicItems => {
      const activeCats = cleanAndDedupeCategories(publicItems.map(p => p.category).filter(Boolean));
      if (activeCats.length > 0) {
        setCategories(['all', ...activeCats]);
      }
    });
  }, []);

  // Filter State
  const [filters, setFilters] = useState<ProductFilterState>({
    category: searchParams.get('category') || 'all',
    style: searchParams.get('style') || 'all',
    minPrice: 0,
    maxPrice: Number(searchParams.get('maxPrice')) || DEFAULT_MAX_PRICE,
    searchQuery: searchParams.get('search') || '',
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sort') as any) || 'newest'
  });

  // Sync search params from URL
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const sty = searchParams.get('style') || 'all';
    const q = searchParams.get('search') || '';
    const maxP = Number(searchParams.get('maxPrice')) || DEFAULT_MAX_PRICE;
    
    setFilters(prev => ({
      ...prev,
      category: cat,
      style: sty,
      searchQuery: q,
      maxPrice: maxP
    }));
  }, [searchParams]);

  // Fetch filtered products with clean Skeleton Loader state
  useEffect(() => {
    setLoading(true);

    productService.getProducts(filters).then(res => {
      setProducts(res);
      setLoading(false);
    });

    const unsub = subscribeToProducts(() => {
      productService.getProducts(filters).then(res => {
        setProducts(res);
        setLoading(false);
      });
    });
    return () => unsub();
  }, [filters]);

  const activeFiltersCount = 
    (filters.category !== 'all' ? 1 : 0) +
    (filters.style !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < DEFAULT_MAX_PRICE ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      category: 'all',
      style: 'all',
      minPrice: 0,
      maxPrice: DEFAULT_MAX_PRICE,
      searchQuery: '',
      inStockOnly: false,
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  // Reusable Filter Content (Used in Desktop Sticky Sidebar & Mobile Drawer)
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Search Query Filter Badge */}
      {filters.searchQuery && (
        <div className="bg-brand-black text-white p-3 text-xs flex justify-between items-center shadow-subtle">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <Search className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Búsqueda: <strong>"{filters.searchQuery}"</strong></span>
          </div>
          <button 
            onClick={() => {
              setFilters(p => ({ ...p, searchQuery: '' }));
              searchParams.delete('search');
              setSearchParams(searchParams);
            }}
            className="hover:text-amber-300"
            title="Quitar filtro de búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Categoría</h4>
        <div className="space-y-1.5 text-xs">
          {categories.map(cat => {
            const isChecked = filters.category.toLowerCase() === cat.toLowerCase();
            return (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-brand-black py-0.5">
                <input 
                  type="radio"
                  name="category"
                  checked={isChecked}
                  onChange={() => {
                    setFilters(prev => ({ ...prev, category: cat }));
                    if (cat === 'all') searchParams.delete('category');
                    else searchParams.set('category', cat);
                    setSearchParams(searchParams);
                  }}
                  className="accent-black w-4 h-4 cursor-pointer"
                />
                <span className={isChecked ? 'font-bold text-brand-black' : ''}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Style Filter */}
      <div className="space-y-3 pt-4 border-t border-brand-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Estilo Arquitectónico</h4>
        <div className="space-y-1.5 text-xs">
          {STYLES.map(style => {
            const isChecked = filters.style.toLowerCase() === style.toLowerCase();
            return (
              <label key={style} className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-brand-black py-0.5">
                <input 
                  type="radio"
                  name="style"
                  checked={isChecked}
                  onChange={() => {
                    setFilters(prev => ({ ...prev, style: style }));
                    if (style === 'all') searchParams.delete('style');
                    else searchParams.set('style', style);
                    setSearchParams(searchParams);
                  }}
                  className="accent-black w-4 h-4 cursor-pointer"
                />
                <span className={isChecked ? 'font-bold text-brand-black' : ''}>
                  {style === 'all' ? 'Todos los estilos' : style}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Filter (Colombian Pesos COP) */}
      <div className="space-y-3 pt-4 border-t border-brand-border">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Precio Máximo</h4>
          <span className="text-xs font-bold text-brand-black">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input 
          type="range"
          min="0"
          max={DEFAULT_MAX_PRICE}
          step="250000"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-400">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(DEFAULT_MAX_PRICE)}</span>
        </div>
      </div>

      {/* Stock Filter */}
      <div className="pt-4 border-t border-brand-border">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-brand-black py-1">
          <input 
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="accent-black w-4 h-4 cursor-pointer"
          />
          <span>Mostrar solo productos en stock</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-10 pb-24 md:pb-10 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-brand-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Catálogo & Colecciones
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-light text-brand-black tracking-tight">
            Iluminación & Arquitectura de Interiores
          </h1>
        </div>

        {/* Top Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 border border-brand-black text-brand-black px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white shadow-xs active:bg-neutral-100"
          >
            <Filter className="w-3.5 h-3.5" /> 
            <span>Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-500 uppercase tracking-wider text-[11px] hidden sm:inline">Ordenar:</span>
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-brand-surface border border-brand-border text-brand-black font-medium py-2 px-3 focus:outline-none focus:border-brand-black text-xs"
            >
              <option value="newest">Más Recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar: items-start allows sticky position on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10 items-start">
        
        {/* DESKTOP STICKY SIDEBAR: Stays in view as user scrolls */}
        <aside className="hidden md:block md:col-span-1 md:sticky md:top-[125px] lg:top-[145px] md:max-h-[calc(100vh-165px)] md:overflow-y-auto pr-3 space-y-6 [scrollbar-width:thin] [scrollbar-color:#d4d4d4_transparent]">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filtros Avanzados
            </h3>
            {activeFiltersCount > 0 && (
              <button 
                onClick={resetFilters}
                className="text-[10px] uppercase font-semibold text-neutral-400 hover:text-brand-black flex items-center gap-1 transition-colors"
                title="Limpiar todos los filtros"
              >
                <RefreshCw className="w-3 h-3" /> Limpiar
              </button>
            )}
          </div>

          {renderFilterContent()}
        </aside>

        {/* Product Catalog Grid */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-brand-border">
            <span className="text-xs text-neutral-500 font-medium">
              Mostrando <strong className="text-brand-black">{products.length}</strong> {products.length === 1 ? 'pieza encontrada' : 'piezas encontradas'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map(product => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-brand-surface p-12 text-center space-y-4 border border-brand-border">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black">
                No se encontraron productos
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No hay artículos que coincidan con los filtros seleccionados. Intenta ampliar el rango de precio o cambiar de categoría.
              </p>
              <button 
                onClick={resetFilters}
                className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3 px-6 hover:bg-neutral-800 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </main>

      </div>

      {/* MOBILE BOTTOM TOOLBAR (White Header Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center divide-x divide-brand-border h-14">
          
          {/* 1. FILTROS BUTTON */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 h-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black active:bg-neutral-100 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-900" />
            <span>Filtros</span>
            {activeFiltersCount > 0 ? (
              <span className="bg-brand-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 font-normal tracking-normal lowercase">({products.length})</span>
            )}
          </button>

          {/* 2. ORDENAR BUTTON (Native picker on tap) */}
          <div className="flex-1 h-full relative flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black active:bg-neutral-100 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-900" />
            <span className="truncate max-w-[130px]">
              {filters.sortBy === 'newest' ? 'Más Recientes' :
               filters.sortBy === 'price-asc' ? 'Menor Precio' :
               filters.sortBy === 'price-desc' ? 'Mayor Precio' : 'Nombre (A-Z)'}
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Ordenar productos"
            >
              <option value="newest">Más Recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>

        </div>
      </div>

      {/* MOBILE FILTER DRAWER (SLIDE-OVER FROM RIGHT) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-black" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">
                  Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-[11px] uppercase font-semibold text-neutral-500 hover:text-brand-black transition-colors"
                  >
                    Limpiar
                  </button>
                )}
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-200 transition-colors"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {renderFilterContent()}
            </div>

            {/* Drawer Footer with Results CTA */}
            <div className="p-4 border-t border-brand-border bg-white shadow-lg">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-brand-black text-white py-3.5 text-xs font-bold uppercase tracking-widest text-center shadow-md active:bg-neutral-800 transition-colors"
              >
                Ver {products.length} {products.length === 1 ? 'Pieza' : 'Piezas'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
