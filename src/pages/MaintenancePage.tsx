import React from 'react';
import { Clock, ShieldAlert, Database, Wrench } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white flex flex-col justify-between items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header with Logo */}
      <header className="z-10 flex flex-col items-center">
        <img 
          src="/images/logo_black.png" 
          alt="Diseño Tu Espacio - By Alexis Madrigal"
          className="h-20 sm:h-24 md:h-28 w-auto object-contain brightness-0 invert drop-shadow-md transition-all duration-300"
        />
      </header>

      {/* Main Content Box */}
      <main className="z-10 max-w-2xl text-center my-auto px-6 py-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-8 animate-pulse">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Actualización de Infraestructura</span>
        </div>

        {/* Main Message Requested by User */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Estamos en mantenimiento <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
            hasta las 2:00 PM
          </span>
        </h1>

        {/* Informative Description */}
        <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-xl mx-auto">
          Nos encontramos realizando una reestructuración estratégica en nuestra base de datos y catálogo de productos para brindarte un servicio más veloz, preciso y seguro.
        </p>

        {/* Restrictions Warning Card */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-left text-xs sm:text-sm text-neutral-400 space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-200 block mb-0.5">Acceso temporalmente restringido</strong>
              El sistema público y el panel administrativo han sido pausados para prevenir modificaciones accidentales de inventario o pedidos durante la migración de datos.
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <p className="text-xs text-neutral-400 font-light mt-6">
          ¿Eres cliente o requieres atención urgente con un pedido existente? Comunícate directamente vía WhatsApp.
        </p>
      </main>

      {/* Footer Note */}
      <footer className="z-10 text-center text-neutral-500 text-xs tracking-wider uppercase font-medium mt-8">
        Diseño Tu Espacio © {new Date().getFullYear()} • Todos los derechos reservados
      </footer>

      {/* Floating Corporate WhatsApp Button */}
      <WhatsAppButton phoneNumber="573113477785" />
    </div>
  );
};
