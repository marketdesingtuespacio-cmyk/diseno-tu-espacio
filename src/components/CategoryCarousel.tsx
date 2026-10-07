import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  categoryFilter?: string;
  isNewCard?: boolean;
  image?: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
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
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-papel',
    name: 'PAPEL DE COLGADURA',
    categoryFilter: 'Papel de Colgadura',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-lavamanos',
    name: 'LAVAMANOS',
    categoryFilter: 'Lavamanos',
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A691CBKUG04M_1.jpg'
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
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
];

export const CategoryCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
            className="p-1.5 sm:p-2 border border-brand-border hover:border-black text-brand-black transition-colors"
            aria-label="Anterior categoría"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="p-1.5 sm:p-2 border border-brand-border hover:border-black text-brand-black transition-colors"
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
        {CATEGORY_ITEMS.map((item) => (
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
              ) : (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                />
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
