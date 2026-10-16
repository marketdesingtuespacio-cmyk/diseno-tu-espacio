import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export const AnimatedHeroHeader: React.FC = () => {
  return (
    <section className="relative h-[85vh] sm:h-[90vh] bg-neutral-900 text-white flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* VIDEO TOUR BACKGROUND: Sin fondos oscuros ni capas pesadas para apreciar el video con claridad */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/house_interior_tour.mp4" type="video/mp4" />
          Tu navegador no soporta videos en HTML5.
        </video>
      </div>

      {/* Sutil viñeta inferior y superior ultraligera para garantizar legibilidad del menú y botones */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 z-0 pointer-events-none" />

      {/* CONTENIDO EDITORIAL CENTRAL: Limpio, minimalista y espacioso */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-4">
        
        {/* Subtítulo de colección */}
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] block">
          Arquitectura & Acabados de Autor
        </span>

        {/* Título Principal enfocado en el catálogo real */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white leading-tight drop-shadow-[0_3px_15px_rgba(0,0,0,0.85)]">
          Mobiliario, Acabados & Diseño de Interiores
        </h1>
        
        {/* Descripción breve que resalta los productos */}
        <p className="text-xs sm:text-sm md:text-base text-white/95 max-w-xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          Espejos, piedra flexible, papel de colgadura, lavamanos de lujo y arte seleccionados para transformar cada ambiente.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link 
            to="/catalog" 
            className="w-full sm:w-auto bg-white text-brand-black text-xs font-bold uppercase tracking-widest py-3.5 px-8 hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95"
          >
            Explorar Catálogo <ArrowRight className="w-4 h-4" />
          </Link>

          <Link 
            to="/booking" 
            className="w-full sm:w-auto bg-black/40 hover:bg-black/60 border border-white/70 hover:border-white text-white text-xs font-bold uppercase tracking-widest py-3.5 px-8 transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-2xl active:scale-95"
          >
            <Calendar className="w-4 h-4" /> Agendar Asesoría
          </Link>
        </div>

      </div>

    </section>
  );
};
