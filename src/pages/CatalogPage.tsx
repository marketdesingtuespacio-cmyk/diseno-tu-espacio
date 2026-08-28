import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown, RefreshCw, Search } from 'lucide-react';
import { Product, ProductFilterState } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { useCurrency } from '../context/CurrencyContext';

const CATEGORIES = ['all', 'Lámparas de Techo', 'Iluminación de Pared', 'Lámparas de Pie', 'Lámparas de Mesa', 'Diseño Mobiliario'];
const STYLES = ['all', 'Minimalista', 'Contemporáneo', 'Bauhaus', 'Nórdico'];
const DEFAULT_MAX_PRICE = 20000000; // $20.000.000 COP default max threshold

export const CatalogPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // Fetch filtered products
  useEffect(() => {
    setLoading(true);
    productService.getProducts(filters).then(res => {
      setProducts(res);
      setLoading(false);
    });
  }, [filters]);

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

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-brand-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Catálogo & Colecciones
          </span>
          <h1 className="text-3xl font-serif font-light text-brand-black tracking-tight">
            Iluminación & Arquitectura de Interiores
          </h1>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 border border-brand-black text-brand-black px-4 py-2 text-xs font-bold uppercase tracking-widest"
          >
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>

          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-500 uppercase tracking-wider text-[11px]">Ordenar:</span>
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-brand-surface border border-brand-border text-brand-black font-medium py-1.5 px-3 focus:outline-none focus:border-brand-black text-xs"
            >
              <option value="newest">Más Recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Filter Sidebar (Desktop & Mobile Drawer) */}
        <aside className={`md:block space-y-8 ${isMobileFilterOpen ? 'block' : 'hidden'} bg-brand-surface md:bg-transparent p-6 md:p-0 border md:border-none border-brand-border mb-8 md:mb-0`}>
          
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filtros Avanzados
            </h3>
            <button 
              onClick={resetFilters}
              className="text-[10px] uppercase font-medium text-neutral-400 hover:text-brand-black flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Limpiar
            </button>
          </div>

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
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-brand-black">
                  <input 
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => {
                      setFilters(prev => ({ ...prev, category: cat }));
                      if (cat === 'all') searchParams.delete('category');
                      else searchParams.set('category', cat);
                      setSearchParams(searchParams);
                    }}
                    className="accent-black"
                  />
                  <span className={filters.category === cat ? 'font-bold text-brand-black' : ''}>
                    {cat === 'all' ? 'Todas las categorías' : cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Estilo Arquitectónico</h4>
            <div className="space-y-1.5 text-xs">
              {STYLES.map(style => (
                <label key={style} className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-brand-black">
                  <input 
                    type="radio"
                    name="style"
                    checked={filters.style === style}
                    onChange={() => {
                      setFilters(prev => ({ ...prev, style: style }));
                      if (style === 'all') searchParams.delete('style');
                      else searchParams.set('style', style);
                      setSearchParams(searchParams);
                    }}
                    className="accent-black"
                  />
                  <span className={filters.style === style ? 'font-bold text-brand-black' : ''}>
                    {style === 'all' ? 'Todos los estilos' : style}
                  </span>
                </label>
              ))}
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
          </div>

          {/* Stock Filter */}
          <div className="pt-4 border-t border-brand-border">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-brand-black">
              <input 
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                className="accent-black"
              />
              <span>Mostrar solo productos en stock</span>
            </label>
          </div>

        </aside>

        {/* Product Catalog Grid */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-brand-border">
            <span className="text-xs text-neutral-500 font-medium">
              Mostrando <strong className="text-brand-black">{products.length}</strong> piezas encontradas
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="aspect-[1900/2375] bg-brand-surface animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

    </div>
  );
};
