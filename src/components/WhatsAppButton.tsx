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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-white/20"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        className="w-7 h-7 fill-current transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.056 3.858 3.799-.991zm11.233-5.992c-.113-.189-.415-.302-.868-.528-.453-.226-2.679-1.321-3.094-1.472-.415-.151-.717-.226-.981.226-.264.453-1.019 1.472-1.246 1.736-.226.264-.453.302-.906.075-.453-.226-1.913-.705-3.644-2.248-1.348-1.202-2.259-2.686-2.523-3.139-.264-.453-.028-.698.198-.923.204-.203.453-.528.679-.792.226-.264.302-.453.453-.755.151-.302.075-.566-.038-.792-.113-.226-.981-2.361-1.342-3.23-.351-.845-.712-.731-.981-.745l-.837-.015c-.264 0-.698.098-1.063.498-.365.4-.139 1.564 1.396 3.528.849 1.964 2.879 3.856 5.459 4.969 2.58 1.113 2.58.742 3.033.698.453-.044 1.459-.597 1.666-1.173.207-.576.207-1.07.145-1.173z" />
      </svg>
      <span className="font-semibold text-sm tracking-wide hidden sm:inline-block">
        ¿Necesitas ayuda? Escríbenos
      </span>
      {/* Pulse badge effect */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
};
