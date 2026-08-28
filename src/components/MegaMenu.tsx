import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Compass, Award, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 w-full bg-brand-white border-b border-brand-border shadow-elevated z-50 transition-all duration-300"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-8">
        
        {/* Column 1: Colecciones de Iluminación */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-brand-black border-b border-brand-black pb-2">
            <Lightbulb className="w-4 h-4" />
            Iluminación de Alta Gama
          </div>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            <li>
              <Link to="/catalog?category=Lámparas de Techo" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Lámparas de Techo & Suspensión
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=Iluminación de Pared" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Apliques & Iluminación Indirecta
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=Lámparas de Pie" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Lámparas de Pie Esculturales
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=Lámparas de Mesa" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Lámparas de Sobremesa
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=all" onClick={onClose} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-black mt-2 hover:underline">
                Ver Colección Completa <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Estilos Arquitectónicos */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-brand-black border-b border-brand-black pb-2">
            <Compass className="w-4 h-4" />
            Estilos & Tendencias
          </div>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            <li>
              <Link to="/catalog?style=Minimalista" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Minimalismo Monocromático
              </Link>
            </li>
            <li>
              <Link to="/catalog?style=Contemporáneo" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Contemporáneo Escultural
              </Link>
            </li>
            <li>
              <Link to="/catalog?style=Bauhaus" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Líneas Bauhaus & Geométricas
              </Link>
            </li>
            <li>
              <Link to="/catalog?style=Nórdico" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Nórdico Cálido
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Servicios de Asesoría */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-brand-black border-b border-brand-black pb-2">
            <Award className="w-4 h-4" />
            Servicios Exclusivos
          </div>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            <li>
              <Link to="/booking" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Estudio Lumínico Residencial
              </Link>
            </li>
            <li>
              <Link to="/booking" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Visita de Interiorismo In-Situ
              </Link>
            </li>
            <li>
              <Link to="/booking" onClick={onClose} className="hover:text-brand-black hover:font-medium transition-colors">
                Proyectos Llave en Mano
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Destacado Editorial */}
        <div className="bg-brand-surface p-5 rounded-none border border-brand-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-brand-muted mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-black" /> Destacado de la Semana
            </div>
            <h4 className="text-base font-medium mb-1">Colección Canopée</h4>
            <p className="text-xs text-neutral-500 leading-normal mb-4">
              Esculturas de luz en aluminio cepillado de grado aeroespacial.
            </p>
          </div>
          <Link 
            to="/catalog?category=Lámparas de Techo" 
            onClick={onClose}
            className="w-full text-center bg-brand-black text-white text-xs uppercase tracking-widest font-medium py-2.5 px-4 hover:bg-neutral-800 transition-colors"
          >
            Explorar Colección
          </Link>
        </div>

      </div>
    </div>
  );
};
