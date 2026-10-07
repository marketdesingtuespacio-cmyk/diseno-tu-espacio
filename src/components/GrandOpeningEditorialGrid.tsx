import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, Store } from 'lucide-react';

interface EditorialBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  link: string;
  image: string;
  isAnnouncement?: boolean;
  announcementDate?: string;
  tag?: string;
}

export const GrandOpeningEditorialGrid: React.FC = () => {
  const banners: EditorialBannerItem[] = [
    // Cuadro 1: Gran Apertura de la Tienda (16 de Octubre)
    {
      id: 'banner-apertura',
      title: 'Gran Apertura Oficial de Nuestra Tienda',
      subtitle: 'Te invitamos a descubrir un espacio exclusivo de interiorismo, mobiliario de autor y asesoría personalizada.',
      ctaText: 'Conoce los detalles',
      link: '/booking',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      isAnnouncement: true,
      announcementDate: '16 DE OCTUBRE',
      tag: 'PRÓXIMO EVENTO'
    },
    // Cuadro 2: Colección Espejos & Iluminación Escultural
    {
      id: 'banner-espejos',
      title: 'Espejos de Autor & Marcos Minimalistas',
      subtitle: 'Piezas arquitectónicas diseñadas para multiplicar la luz y expandir la perspectiva de cada ambiente.',
      ctaText: 'Explorar Espejos',
      link: '/catalog?category=Espejos',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      tag: 'COLECCIÓN EXCLUSIVA'
    },
    // Cuadro 3: Lavamanos & Diseños para Baño de Lujo
    {
      id: 'banner-lavamanos',
      title: 'Lavamanos Esculturales & Acabados Nobles',
      subtitle: 'Materiales nobles y formas puras que elevan la experiencia del baño contemporáneo.',
      ctaText: 'Ver Lavamanos',
      link: '/catalog?category=Lavamanos',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      tag: 'NUEVA LÍNEA'
    },
    // Cuadro 4: Papel de Colgadura & Revestimientos Texturados
    {
      id: 'banner-papel',
      title: 'Papel de Colgadura & Revestimientos',
      subtitle: 'Texturas táctiles y patrones sofisticados para transformar los muros en obras de arte.',
      ctaText: 'Descubrir Colección',
      link: '/catalog?category=Papel de Colgadura',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      tag: 'TENDENCIAS 2026'
    }
  ];

  return (
    <section className="w-full bg-[#FAF9F6] py-12 sm:py-16 font-sans select-none border-y border-neutral-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-neutral-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-stone-600 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
              <Sparkles className="w-4 h-4 text-[#81c0b1]" />
              <span>Espacios de Vanguardia & Celebración</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-stone-900 tracking-tight leading-tight">
              Inspiración & Apertura
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md font-light leading-relaxed">
            Un diálogo entre arquitectura, texturas y mobiliario. Cada rincón concebido para inspirar tus proyectos residenciales y comerciales.
          </p>
        </div>

        {/* 4 Elegant Split Banners (2x2 Grid) Westwing Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {banners.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative overflow-hidden h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center text-center p-6 sm:p-10 transition-all duration-700 bg-neutral-900"
            >
              {/* Background Photographic Image with Smooth Scale on Hover */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Atmospheric Editorial Contrast Overlays */}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* Special Accent Badge for Gran Apertura (Cuadro 1) */}
              {item.isAnnouncement && (
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#81c0b1] text-stone-950 px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] uppercase shadow-lg">
                  <Store className="w-3.5 h-3.5" />
                  <span>Apertura: {item.announcementDate}</span>
                </div>
              )}

              {/* Tag for other cards */}
              {!item.isAnnouncement && item.tag && (
                <div className="absolute top-6 left-6 z-20 text-[10px] tracking-[0.25em] font-semibold uppercase text-stone-200/90 bg-black/40 backdrop-blur-xs px-3 py-1 border border-white/20">
                  {item.tag}
                </div>
              )}

              {/* Centered Editorial Content */}
              <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 text-white">
                
                {item.isAnnouncement && (
                  <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.3em] font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Inauguración de Tienda Física</span>
                  </div>
                )}

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-tight text-white leading-tight drop-shadow-md">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed max-w-md hidden sm:block drop-shadow-sm">
                    {item.subtitle}
                  </p>
                )}

                {/* Elegant Underlined Link */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-light tracking-wider text-white border-b border-white pb-1 group-hover:border-[#81c0b1] group-hover:text-[#81c0b1] transition-all duration-300">
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>

              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
