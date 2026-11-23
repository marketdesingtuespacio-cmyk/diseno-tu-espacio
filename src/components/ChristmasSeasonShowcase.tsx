import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, ArrowRight, MessageCircle, Star } from 'lucide-react';

interface ChristmasFeatureCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  priceHighlight: string;
  image: string;
  link: string;
  ctaLabel: string;
}

const CHRISTMAS_CARDS: ChristmasFeatureCard[] = [
  {
    id: 'navidad-espejos',
    badge: '🎄 Destello de Nochebuena',
    title: 'Espejos de Autor & Marcos Dorados',
    subtitle:
      'Multiplica el brillo de tu árbol de Navidad y las velas de tu comedor con espejos orgánicos y circulares en acabado champaña y oro.',
    priceHighlight: 'Desde $670.000 COP',
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Espejos__AHR80006GD_1792100214224.jpeg',
    link: '/catalog?category=Espejos',
    ctaLabel: 'Ver Espejos de Navidad',
  },
  {
    id: 'navidad-papeles',
    badge: '🎁 Regalo Estrella -20% OFF',
    title: 'Muros de Gala en Papel de Colgadura',
    subtitle:
      'Transforma tu sala o habitación principal antes de las fiestas con texturas de lino, seda y piedra natural de instalación limpia en 1 día.',
    priceHighlight: 'Oferta Navidad: $480.000 COP',
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680209_1.jpeg',
    link: '/catalog?category=Papel de Colgadura',
    ctaLabel: 'Elegir Papel Festivo',
  },
  {
    id: 'navidad-lavamanos',
    badge: '✨ Sorprende a tus Invitados',
    title: 'Lavamanos Esculturales Black & Gold',
    subtitle:
      'Renueva el baño social para tus cenas navideñas con piezas monolíticas en cerámica negra mate y detalles dorados de lujo.',
    priceHighlight: 'Desde $603.000 COP',
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A691CBKUG04M_1.jpg',
    link: '/catalog?category=Lavamanos',
    ctaLabel: 'Explorar Lavamanos',
  },
];

export const ChristmasSeasonShowcase: React.FC = () => {
  return (
    <section
      id="especial-navidad"
      aria-label="Colección Especial de Navidad y Regalos para el Hogar"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#072215] via-[#0e3320] to-[#4c0811] text-white border-2 border-amber-400/50 shadow-[0_20px_60px_rgba(11,36,24,0.35)] p-6 sm:p-10 lg:p-12">
        
        {/* Decorative Background SVG Snowflakes & Golden Stars */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 400"
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
        >
          <circle cx="90" cy="60" r="3" fill="#fde047" />
          <circle cx="220" cy="140" r="2" fill="#ffffff" />
          <circle cx="420" cy="50" r="3.5" fill="#fde047" />
          <circle cx="680" cy="90" r="4" fill="#fde047" />
          <circle cx="740" cy="260" r="2.5" fill="#ffffff" />
          <circle cx="130" cy="310" r="3" fill="#fde047" />
          <path
            d="M650 30 L654 44 L668 48 L654 52 L650 66 L646 52 L632 48 L646 44 Z"
            fill="#fde047"
          />
          <path
            d="M140 50 L143 60 L153 63 L143 66 L140 76 L137 66 L127 63 L137 60 Z"
            fill="#fde047"
          />
        </svg>

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-amber-400/30 pb-8 mb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-800/80 border border-amber-300/60 text-amber-200 text-[11px] font-bold uppercase tracking-[0.22em]">
              <Gift className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>🎄 Temporada de Navidad • Diseño Tu Espacio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white tracking-tight leading-tight">
              La Magia de la Navidad comienza en un{' '}
              <span className="text-amber-300 font-medium italic">Hogar de Autor</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-light leading-relaxed">
              Prepara cada rincón de tu casa para las novenas, la cena de Nochebuena y el Año Nuevo. Seleccionamos nuestras piezas más cálidas y luminosas con despacho inmediato en Medellín y toda Colombia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/573113477785?text=Hola%20Dise%C3%B1o%20Tu%20Espacio%20%F0%9F%8E%84%2C%20quisiera%20asesor%C3%ADa%20para%20decorar%20y%20renovar%20mi%20hogar%20en%20esta%20Navidad."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-neutral-950" aria-hidden="true" />
              <span>Asesoría Navideña WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Festive Showcase Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHRISTMAS_CARDS.map((card) => (
            <Link
              key={card.id}
              to={card.link}
              className="group relative rounded-2xl overflow-hidden bg-black/45 border border-amber-400/35 hover:border-amber-300 transition-all duration-500 flex flex-col justify-between shadow-xl hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-neutral-950">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#7f1d1d]/95 border border-amber-300/60 text-amber-200 text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {card.badge}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                  {card.priceHighlight}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0b2418]/90 to-[#07170f]/95">
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-white group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-emerald-100/80 font-light leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-300">
                  <span>{card.ctaLabel}</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Festive Perks Strip */}
        <div className="relative z-10 mt-8 pt-6 border-t border-amber-400/25 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-amber-100/90">
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 text-amber-300 shrink-0 fill-amber-300" aria-hidden="true" />
            <span>🎄 Empaque especial protegido para regalos de Navidad</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
            <span>🎁 Showroom en Laureles vestido de Navidad (Cq. 1 #73-86)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Gift className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
            <span>✨ Despachos garantizados antes del 24 de diciembre</span>
          </div>
        </div>

      </div>
    </section>
  );
};
