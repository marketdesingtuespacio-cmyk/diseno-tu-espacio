import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Calendar, Zap, Play, Pause } from 'lucide-react';

interface LightingStep {
  id: number;
  label: string;
  sublabel: string;
  image: string;
}

const LIGHTING_STEPS: LightingStep[] = [
  {
    id: 0,
    label: 'Fase 0: Penumbra Atardecer',
    sublabel: 'Residencia en penumbra sin luminarias encendidas',
    image: '/images/hero_house_dark_1787590069530.jpg'
  },
  {
    id: 1,
    label: 'Fase 1: Balizas de Jardín & Sendero',
    sublabel: 'Encendido de proyectores de suelo y luminarias de camino',
    image: '/images/hero_step1_path_1787590496977.jpg'
  },
  {
    id: 2,
    label: 'Fase 2: Apliques de Fachada MURAL',
    sublabel: 'Encendido de luminarias arquitectónicas en madera y concreto',
    image: '/images/hero_step2_facade_1787590507275.jpg'
  },
  {
    id: 3,
    label: 'Fase 3: Iluminación de Planta Baja',
    sublabel: 'Encendido de luminarias de salón principal y chimenea',
    image: '/images/hero_step3_ground_floor_1787590517324.jpg'
  },
  {
    id: 4,
    label: 'Fase 4: Iluminación Integral de la Residencia',
    sublabel: 'Encendido de suite principal y pérgola superior',
    image: '/images/hero_step4_full_lit_1787590528177.jpg'
  }
];

export const AnimatedHeroHeader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Progressive bulb-by-bulb lighting sequence loop (Calm & Slower Cinematic Pace)
  useEffect(() => {
    if (!isPlaying) return;

    // Advance to next lighting step every 3.0s, holding 5.0s on full residence illumination
    const stepDuration = currentStep === 4 ? 5000 : 3000;

    const timer = setTimeout(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % LIGHTING_STEPS.length);
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  return (
    <section className="relative h-[88vh] bg-brand-black text-white flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* PROGRESSIVE LIGHTING IMAGE LAYERS (Cinematic Slower Crossfade 1.8s + GPU Hardware Accelerated) */}
      {LIGHTING_STEPS.map((step) => (
        <div 
          key={step.id}
          className={`absolute inset-0 z-0 transition-opacity duration-[1800ms] ease-in-out will-change-opacity ${
            currentStep === step.id ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <img 
            src={step.image} 
            alt={step.label}
            decoding="async"
            loading={step.id === 0 || step.id === 1 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Atmospheric Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent z-0" />
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* PHASE CONTROL CARD: VERTICALLY CENTERED ON THE RIGHT SIDE */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-20 flex flex-col items-end gap-2">
        <div className="bg-black/60 backdrop-blur-md border border-white/20 p-3 shadow-elevated max-w-xs space-y-2 text-right">
          
          <div className="flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            <span>{LIGHTING_STEPS[currentStep].label}</span>
          </div>

          <p className="text-[10px] text-neutral-300 font-light leading-tight">
            {LIGHTING_STEPS[currentStep].sublabel}
          </p>

          {/* Sequential Step Progress Bars */}
          <div className="flex items-center justify-end gap-1.5 pt-1">
            {LIGHTING_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(step.id);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentStep === step.id 
                    ? 'w-6 bg-amber-400 shadow-[0_0_8px_#f59e0b]' 
                    : currentStep > step.id 
                    ? 'w-3 bg-amber-200/80' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={step.label}
              />
            ))}

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="ml-2 text-white/80 hover:text-white transition-colors"
              title={isPlaying ? 'Pausar secuencia' : 'Reproducir secuencia'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MAIN HERO EDITORIAL CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-white text-[11px] font-bold tracking-widest uppercase border border-white/20">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Secuencia Lumínica Paso a Paso • Edición 2026</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-white leading-tight drop-shadow-md">
          La Escultura de la Luz en el Espacio
        </h1>
        
        <p className="text-sm md:text-base text-neutral-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
          Observa el encendido secuencial de luminarias arquitectónicas en tiempo real. Alta precisión de diseño para iluminar cada rincón de tu espacio.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/catalog" 
            className="w-full sm:w-auto bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest py-4 px-8 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-elevated"
          >
            Explorar Catálogo <ArrowRight className="w-4 h-4" />
          </Link>

          <Link 
            to="/booking" 
            className="w-full sm:w-auto bg-transparent border border-white text-white text-xs font-bold uppercase tracking-widest py-4 px-8 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 backdrop-blur-xs"
          >
            <Calendar className="w-4 h-4" /> Agendar Asesoría Lumínica
          </Link>
        </div>

      </div>

    </section>
  );
};
