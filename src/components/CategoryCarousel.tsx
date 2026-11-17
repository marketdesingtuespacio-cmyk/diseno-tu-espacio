import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { productService, subscribeToProducts, isCategoryMatch } from '../services/productService';

interface CategoryItem {
  id: string;
  name: string;
  categoryFilter?: string;
  isNewCard?: boolean;
  image?: string;
}

// Catálogo base con imágenes curadas de estudio
const CURATED_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-new',
    name: 'NOVEDADES',
    categoryFilter: 'all',
    isNewCard: true
  },
  {
    id: 'cat-espejos',
    name: 'ESPEJOS',
    categoryFilter: 'Espejos',
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Espejos_AHR80001_1792009018407.jpeg'
  },
  {
    id: 'cat-papel',
    name: 'PAPEL DE COLGADURA',
    categoryFilter: 'Papel de Colgadura',
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680209_1.jpeg'
  },
  {
    id: 'cat-lavamanos',
    name: 'LAVAMANOS',
    categoryFilter: 'Lavamanos',
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A691CBKUG04M_1.jpg'
  },
  {
    id: 'cat-lavaplatos',
    name: 'LAVAPLATOS',
    categoryFilter: 'Lavaplatos',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'cat-cuadros',
    name: 'CUADROS',
    categoryFilter: 'Cuadros',
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_GY78X781606_1.jpg'
  },
  {
    id: 'cat-revestimientos',
    name: 'REVESTIMIENTOS',
    categoryFilter: 'Revestimientos',
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Travertine_Flexible_Stone_Panel_Travertine_-3_Travertine-Flexible-Stone-Panel-_Travertine_-3_1791489832647.jpeg'
  },
  {
    id: 'cat-mesas-base',
    name: 'MESAS CON BASE',
    categoryFilter: 'Mesas con Base',
    image: '/images/cat_mesa_1787548081162.jpg'
  },
  {
    id: 'cat-mesas-completas',
    name: 'MESAS COMPLETAS',
    categoryFilter: 'Mesas Completas',
    image: '/images/cat_mesa_portrait_1787589762766.jpg'
  }
];

export const CategoryCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  // Cargar productos públicos y suscribirse a cambios de Supabase
  useEffect(() => {
    // 1. Carga inicial síncrona / rápida desde memoria local
    const syncProducts = productService.getProductsSync(undefined, false);
    if (syncProducts.length > 0) {
      setProducts(syncProducts);
    }

    // 2. Consulta asíncrona a Supabase para verificar stock y estado oficial
    productService.getProducts(undefined, false).then((fetched) => {
      setProducts(fetched);
    });

    // 3. Suscripción en tiempo real: cuando un admin cambie un producto a "Disponible", se actualiza solo
    const unsub = subscribeToProducts(() => {
      productService.getProducts(undefined, false, true).then((fetched) => {
        setProducts(fetched);
      });
    });

    return () => unsub();
  }, []);

  // REGLA INDECLINABLE: Ocultar automáticamente las categorías que no tienen productos disponibles.
  // Solo se activan cuando existan piezas públicas con stock disponible.
  const visibleCategories = useMemo<CategoryItem[]>(() => {
    // Productos que están verdaderamente disponibles para clientes
    const availableProducts = products.filter(p => 
      p.inventory_status !== 'Privado' && 
      p.inventory_status !== 'Agotado' && 
      (p.stock > 0 || p.stock === undefined)
    );

    // Si aún están cargando los productos desde la red, mostrar provisionalmente solo las categorías con inventario comprobado
    if (products.length === 0) {
      return CURATED_CATEGORIES.filter(item => 
        item.isNewCard || ['Espejos', 'Papel de Colgadura', 'Lavamanos', 'Cuadros', 'Revestimientos'].includes(item.categoryFilter || '')
      );
    }

    // Filtrar de la lista curada únicamente aquellas que tienen al menos 1 producto disponible
    const filteredCurated = CURATED_CATEGORIES.filter(item => {
      if (item.isNewCard) return true; // Siempre conservar la tarjeta NEW
      const filter = item.categoryFilter || item.name;
      return availableProducts.some(p => isCategoryMatch(p.category, filter));
    });

    // Detectar si existen nuevas categorías dinámicas con productos disponibles que no estén en la lista curada
    const registeredFilters = new Set(
      CURATED_CATEGORIES.map(c => (c.categoryFilter || c.name).toLowerCase().trim())
    );

    const extraDynamicCategories: CategoryItem[] = [];
    for (const p of availableProducts) {
      const cat = p.category?.trim();
      if (!cat) continue;
      const lower = cat.toLowerCase();
      if (!registeredFilters.has(lower) && !extraDynamicCategories.some(e => e.categoryFilter?.toLowerCase() === lower)) {
        extraDynamicCategories.push({
          id: `cat-dyn-${lower.replace(/\s+/g, '-')}`,
          name: cat.toUpperCase(),
          categoryFilter: cat,
          image: (p.images && p.images.length > 0) ? p.images[0] : undefined
        });
      }
    }

    return [...filteredCurated, ...extraDynamicCategories];
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (filter?: string) => {
    if (filter && filter !== 'all') {
      navigate(`/catalog?category=${encodeURIComponent(filter)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <section className="py-8 max-w-[1400px] mx-auto px-4 sm:px-6 font-sans select-none">
      
      {/* Header with Westwing Serif Typography & Controls */}
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-brand-black tracking-tight">
          Explora nuestras categorías
        </h2>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => handleScroll('left')}
            className="p-1.5 sm:p-2 border border-brand-border hover:border-black text-brand-black transition-colors cursor-pointer"
            aria-label="Anterior categoría"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="p-1.5 sm:p-2 border border-brand-border hover:border-black text-brand-black transition-colors cursor-pointer"
            aria-label="Siguiente categoría"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Strip with Exact 3:4 Vertical Rectangle Proportions & Tight Gaps */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleCategories.map((item) => (
          <div 
            key={item.id}
            onClick={() => handleCategoryClick(item.categoryFilter)}
            className="group cursor-pointer shrink-0 w-[140px] sm:w-[155px] md:w-[170px] lg:w-[185px] snap-start"
          >
            {/* 3:4 Portrait Studio Card Container (Westwing Off-White Studio Canvas #FAF9F6) */}
            <div className="aspect-[3/4] bg-[#FAF9F6] border border-neutral-200/40 flex items-center justify-center p-4 transition-all duration-300 group-hover:bg-[#F4F2EB] relative overflow-hidden">
              {item.isNewCard ? (
                <div className="text-center font-sans tracking-[0.25em] text-3xl sm:text-4xl font-light text-brand-black group-hover:scale-105 transition-transform duration-300">
                  NEW
                </div>
              ) : item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center font-sans font-bold text-xs uppercase tracking-wider text-neutral-400">
                  {item.name}
                </div>
              )}
            </div>

            {/* Label Under Card - Westwing Tight Typography */}
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#111111] mt-2 group-hover:text-black leading-tight">
              {item.name}
            </h3>
          </div>
        ))}
      </div>

    </section>
  );
};
