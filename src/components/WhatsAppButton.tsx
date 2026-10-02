import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

const HELPER_MESSAGES = [
  {
    text: '¡Hola! 👋 ¿Necesitas ayuda eligiendo la iluminación o diseño ideal para tu espacio?',
    whatsappMsg: 'Hola, necesito asesoría sobre iluminación y diseño de interiores.'
  },
  {
    text: '💡 ¿Tienes preguntas sobre disponibilidad de stock, envíos o precios especiales?',
    whatsappMsg: 'Hola, me gustaría consultar información sobre stock, envíos y precios.'
  },
  {
    text: '✨ ¡Estamos en línea! Escríbenos ahora para recibir atención personalizada en tiempo real.',
    whatsappMsg: 'Hola, estoy en la página web y deseo recibir atención personalizada.'
  },
  {
    text: '🛋️ ¿Buscas asesoría en un proyecto residencial o comercial a medida?',
    whatsappMsg: 'Hola, quisiera asesoría para un proyecto a medida.'
  }
];

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '573113477785'
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [unreadBadge, setUnreadBadge] = useState(1);

  // Cambiar mensaje automáticamente cada 1 minuto (60,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % HELPER_MESSAGES.length);
      setIsPopupVisible(true);
      setUnreadBadge((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = HELPER_MESSAGES[messageIndex];
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(currentMessage.whatsappMsg)}`;

  const handleButtonClick = () => {
    setUnreadBadge(0);
    setIsPopupVisible(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Globe Popup Card with Scheduled Message */}
      {isPopupVisible && (
        <div className="mb-3 w-[290px] sm:w-[320px] bg-white text-neutral-800 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-neutral-100 transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-4 relative">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 leading-tight">Asesoría en Línea</h4>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Respuesta inmediata
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPopupVisible(false)}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Cerrar mensaje"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scheduled Message Content */}
          <p className="text-xs text-neutral-700 font-normal leading-relaxed mb-3">
            {currentMessage.text}
          </p>

          {/* CTA Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleButtonClick}
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>Iniciar conversación</span>
            <Send className="w-3.5 h-3.5" />
          </a>

          {/* Speech Bubble Arrow pointing to the WhatsApp button */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-neutral-100"></div>
        </div>
      )}

      {/* Main 3D Sphere WhatsApp Button (Matching Official Image 2) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleButtonClick}
        aria-label="Contactar por WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] hover:from-[#0e6c61] hover:to-[#20ba5a] text-white shadow-[0_10px_30px_rgba(37,211,102,0.6)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.8)] transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/40 backdrop-blur-sm"
      >
        {/* Glowing Aura Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 blur-lg pointer-events-none group-hover:bg-[#25D366]/60 transition-all"></span>

        {/* Official WhatsApp SVG Emblem */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-white drop-shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 z-10"
          viewBox="0 0 24 24"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.163 5.283-1.385c1.455.792 3.1 1.21 4.787 1.211h.003c5.506 0 9.989-4.479 9.99-9.985 0-2.668-1.039-5.176-2.926-7.062a9.923 9.923 0 0 0-7.064-2.928zm5.666 14.18c-.237.667-1.378 1.272-1.91 1.332-.505.056-1.157.08-1.859-.144-1.286-.409-2.937-1.097-4.476-2.637-1.54-1.539-2.228-3.19-2.637-4.476-.224-.702-.2-1.354-.144-1.859.06-.532.665-1.673 1.332-1.91.226-.08.452-.12.633-.12.181 0 .361.006.516.015.18.01.376.023.559.444.225.518.769 1.876.836 2.012.067.135.113.294.023.475-.09.18-.136.294-.271.452-.136.158-.285.352-.407.472-.136.136-.279.284-.12.556.158.271.701 1.157 1.503 1.872 1.03 0.919 1.9 1.203 2.171 1.339.271.136.429.113.587-.068.158-.18.677-.79 0.858-1.061.18-.271.361-.226.602-.136.24.09 1.524.718 1.787.849.263.136.438.203.505.316.067.113.067.654-.17 1.321z" />
        </svg>

        {/* Top Right Online Badge with Ring */}
        <span className="absolute top-0 right-0 z-20 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-white shadow-sm"></span>
        </span>

        {/* Unread Badge Counter when new message triggers */}
        {unreadBadge > 0 && !isPopupVisible && (
          <span className="absolute -top-1 -left-1 z-20 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            {unreadBadge}
          </span>
        )}
      </a>
    </div>
  );
};
