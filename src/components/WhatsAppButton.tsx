import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

const HELPER_MESSAGES = [
  {
    text: '👋 ¿Necesitas ayuda para elegir tu iluminación o diseño ideal?',
    whatsappMsg: 'Hola, necesito asesoría sobre iluminación y diseño de interiores.'
  },
  {
    text: '💡 ¿Consultas de stock, envíos o precios al por mayor?',
    whatsappMsg: 'Hola, quisiera consultar información de stock y envíos.'
  },
  {
    text: '✨ ¡Estamos en línea! Asesoría personalizada en tiempo real.',
    whatsappMsg: 'Hola, me gustaría recibir atención personalizada.'
  },
  {
    text: '🛋️ ¿Buscas un proyecto de arquitectura a medida?',
    whatsappMsg: 'Hola, busco asesoría para un proyecto a medida.'
  }
];

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '573113477785'
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  // Cambiar mensaje automáticamente cada 1 minuto (60,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % HELPER_MESSAGES.length);
      setIsPopupVisible(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = HELPER_MESSAGES[messageIndex];
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(currentMessage.whatsappMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Globo Flotante Sútil y Compacto */}
      {isPopupVisible && (
        <div className="mb-2.5 w-56 sm:w-64 bg-neutral-900/95 text-white rounded-xl p-3 shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-2 relative">
          
          <div className="flex items-start justify-between gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsPopupVisible(false)}
              className="flex-1 group/msg"
            >
              <p className="text-[11px] font-medium leading-relaxed text-neutral-200 group-hover/msg:text-emerald-400 transition-colors">
                {currentMessage.text}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 mt-1.5 hover:underline">
                Escribir por WhatsApp <Send className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </a>

            <button
              onClick={() => setIsPopupVisible(false)}
              className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
              aria-label="Cerrar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flecha discreta apuntando al botón */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-neutral-900/95 transform rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}

      {/* Botón Esférico 3D (Exacto a la Imagen Proporcionada) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsPopupVisible(false)}
        aria-label="Contactar por WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] hover:from-[#0e6c61] hover:to-[#20ba5a] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Brillo Esférico 3D Cristalino (Reflejo Superior) */}
        <span className="absolute top-1 left-3 w-7 h-3.5 bg-white/30 rounded-full blur-[1px] pointer-events-none"></span>

        {/* Logo Oficial WhatsApp (Línea Blanca Exacta a la Imagen) */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.163 5.283-1.385c1.455.792 3.1 1.21 4.787 1.211h.003c5.506 0 9.989-4.479 9.99-9.985 0-2.668-1.039-5.176-2.926-7.062a9.923 9.923 0 0 0-7.064-2.928zm5.666 14.18c-.237.667-1.378 1.272-1.91 1.332-.505.056-1.157.08-1.859-.144-1.286-.409-2.937-1.097-4.476-2.637-1.54-1.539-2.228-3.19-2.637-4.476-.224-.702-.2-1.354-.144-1.859.06-.532.665-1.673 1.332-1.91.226-.08.452-.12.633-.12.181 0 .361.006.516.015.18.01.376.023.559.444.225.518.769 1.876.836 2.012.067.135.113.294.023.475-.09.18-.136.294-.271.452-.136.158-.285.352-.407.472-.136.136-.279.284-.12.556.158.271.701 1.157 1.503 1.872 1.03 0.919 1.9 1.203 2.171 1.339.271.136.429.113.587-.068.158-.18.677-.79 0.858-1.061.18-.271.361-.226.602-.136.24.09 1.524.718 1.787.849.263.136.438.203.505.316.067.113.067.654-.17 1.321z" />
        </svg>
      </a>
    </div>
  );
};
