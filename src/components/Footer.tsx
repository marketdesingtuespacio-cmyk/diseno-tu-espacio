import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black text-white pt-16 pb-12 border-t border-brand-charcoal">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Summary */}
        <div className="space-y-4">
          <span className="font-bold tracking-[0.2em] text-xl text-white block uppercase">
            Diseño Tu Espacio
          </span>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Firma de iluminación de autor y estudio de arquitectura de interiores. Transformamos espacios mediante la geometría de la luz.
          </p>
          <div className="space-y-2 pt-2 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> 
              <span>Laureles • Medellín, Colombia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> 
              <span>+57 300 000 0000 • Atención al Cliente</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> 
              <a href="mailto:marketingdesingespacio@gmail.com" className="hover:text-white transition-colors underline-offset-2 hover:underline">
                marketingdesingespacio@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-4 border-b border-neutral-800 pb-2">
            Colecciones
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/catalog?category=Lámparas de Techo" className="hover:text-white transition-colors">Lámparas de Techo</Link></li>
            <li><Link to="/catalog?category=Iluminación de Pared" className="hover:text-white transition-colors">Apliques de Pared</Link></li>
            <li><Link to="/catalog?category=Lámparas de Pie" className="hover:text-white transition-colors">Lámparas de Pie</Link></li>
            <li><Link to="/catalog?category=Lámparas de Mesa" className="hover:text-white transition-colors">Lámparas de Sobremesa</Link></li>
            <li><Link to="/catalog?category=Diseño Mobiliario" className="hover:text-white transition-colors">Mobiliario de Autor</Link></li>
          </ul>
        </div>

        {/* Interior Design Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-4 border-b border-neutral-800 pb-2">
            Estudio de Diseño
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/booking" className="hover:text-white transition-colors">Reserva de Asesoría Lumínica</Link></li>
            <li><Link to="/booking" className="hover:text-white transition-colors">Visitas de Interiorismo In-Situ</Link></li>
            <li><Link to="/booking" className="hover:text-white transition-colors">Proyectos Residenciales & Contract</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Acceso Profesionales / Admin</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-4 border-b border-neutral-800 pb-2">
            Boletín Editorial
          </h4>
          <p className="text-xs text-neutral-400 mb-4">
            Reciba nuestras publicaciones mensuales sobre tendencias arquitectónicas e iluminación exclusiva.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Gracias por suscribirse al boletín de Diseño Tu Espacio.'); }} className="flex">
            <input 
              type="email" 
              placeholder="Su correo electrónico"
              required
              className="w-full bg-neutral-900 border border-neutral-700 text-xs px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white"
            />
            <button type="submit" className="bg-white text-brand-black px-3 hover:bg-neutral-200 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-[11px] text-neutral-500">
        <p>© 2026 Diseño Tu Espacio • Iluminación & Arquitectura de Interiores. Todos los derechos reservados.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Términos de Servicio</a>
          <a href="#" className="hover:text-white">Política de Cookies</a>
        </div>
      </div>
    </footer>
  );
};
