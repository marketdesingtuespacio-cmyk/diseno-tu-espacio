import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '573113477785',
  message = 'Hola, necesito información y atención personalizada.'
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-[#128C7E] via-[#25D366] to-[#25D366] hover:from-[#0e6c61] hover:to-[#20ba5a] text-white px-5 py-3.5 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group border border-white/30 backdrop-blur-sm"
    >
      {/* Official WhatsApp 3D Emblem Container */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-colors">
        <svg
          className="w-6 h-6 fill-white drop-shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.163 5.283-1.385c1.455.792 3.1 1.21 4.787 1.211h.003c5.506 0 9.989-4.479 9.99-9.985 0-2.668-1.039-5.176-2.926-7.062a9.923 9.923 0 0 0-7.064-2.928zm5.666 14.18c-.237.667-1.378 1.272-1.91 1.332-.505.056-1.157.08-1.859-.144-1.286-.409-2.937-1.097-4.476-2.637-1.54-1.539-2.228-3.19-2.637-4.476-.224-.702-.2-1.354-.144-1.859.06-.532.665-1.673 1.332-1.91.226-.08.452-.12.633-.12.181 0 .361.006.516.015.18.01.376.023.559.444.225.518.769 1.876.836 2.012.067.135.113.294.023.475-.09.18-.136.294-.271.452-.136.158-.285.352-.407.472-.136.136-.279.284-.12.556.158.271.701 1.157 1.503 1.872 1.03 0.919 1.9 1.203 2.171 1.339.271.136.429.113.587-.068.158-.18.677-.79 0.858-1.061.18-.271.361-.226.602-.136.24.09 1.524.718 1.787.849.263.136.438.203.505.316.067.113.067.654-.17 1.321z" />
        </svg>
      </div>

      <span className="font-bold text-sm tracking-wide hidden sm:inline-block drop-shadow-sm">
        ¿Necesitas ayuda? Escríbenos
      </span>

      {/* Live Online Indicator Badge */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-sm"></span>
      </span>
    </a>
  );
};
