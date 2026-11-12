import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface WallpaperItem {
  sku: string;
  name: string;
  collection: string;
  regularPrice: number;
  discountPrice: number;
  image: string;
}

const WALLPAPER_PREVIEWS: WallpaperItem[] = [
  {
    sku: 'MD681511',
    name: 'Textura Lino Arena',
    collection: 'Serie Textil Contemporánea',
    regularPrice: 800000,
    discountPrice: 640000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD681511_2.jpeg',
  },
  {
    sku: 'MD680313',
    name: 'Piedra Caliza & Seda',
    collection: 'Colección Mineral Luxury',
    regularPrice: 800000,
    discountPrice: 640000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680313_1.jpeg',
  },
  {
    sku: 'MD680101',
    name: 'Estuco Gris Grafito',
    collection: 'Minimalismo Monolítico',
    regularPrice: 800000,
    discountPrice: 640000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680101_2.jpeg',
  },
  {
    sku: 'MD680402B',
    name: 'Fibra Botánica & Carbón',
    collection: 'Edición Especial de Autor',
    regularPrice: 800000,
    discountPrice: 640000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680402B_1.jpeg',
  },
];

const getDeadlineTime = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  // Month 10 = November (0-indexed). Target: Nov 30, 23:59:59
  const target = new Date(year, 10, 30, 23, 59, 59).getTime();
  if (now.getTime() > target) {
    return new Date(year + 1, 10, 30, 23, 59, 59).getTime();
  }
  return target;
};

const formatPriceCOP = (val: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);

export const AnimatedHeroHeader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem>(WALLPAPER_PREVIEWS[0]);
  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  // Countdown timer until November 30
  useEffect(() => {
    const deadline = getDeadlineTime();

    const calculate = () => {
      const diff = Math.max(0, deadline - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const timerId = window.setInterval(calculate, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  // Canvas animation: Fluid 3D Red Silk Ribbon Waves & Particle Shimmer (Simulating video/motion design)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsAnimationRunning(false);
    }

    let step = 0;

    // Silk Ribbon Curves data
    const ribbons = [
      { yRatio: 0.35, speed: 0.012, amp: 55, freq: 0.003, color1: 'rgba(239, 68, 68, 0.45)', color2: 'rgba(185, 28, 28, 0.15)', stroke: 'rgba(255, 100, 100, 0.6)' },
      { yRatio: 0.52, speed: 0.016, amp: 75, freq: 0.0025, color1: 'rgba(220, 38, 38, 0.55)', color2: 'rgba(153, 27, 27, 0.2)', stroke: 'rgba(254, 202, 202, 0.8)' },
      { yRatio: 0.70, speed: 0.010, amp: 60, freq: 0.0035, color1: 'rgba(185, 28, 28, 0.35)', color2: 'rgba(127, 29, 29, 0.1)', stroke: 'rgba(239, 68, 68, 0.5)' },
    ];

    // Floating light embers
    const embers = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.8 - 0.2,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark ambient vignette with central red glow
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, 'rgba(38, 12, 14, 0.4)');
      bgGrad.addColorStop(0.5, 'rgba(18, 18, 22, 0.7)');
      bgGrad.addColorStop(1, 'rgba(10, 10, 12, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw undulating 3D red silk ribbons
      ribbons.forEach((ribbon, index) => {
        const baseY = height * ribbon.yRatio;
        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= width; x += 15) {
          const wave1 = Math.sin(x * ribbon.freq + step * ribbon.speed) * ribbon.amp;
          const wave2 = Math.cos(x * ribbon.freq * 0.6 - step * ribbon.speed * 0.7) * (ribbon.amp * 0.4);
          ctx.lineTo(x, baseY + wave1 + wave2);
        }

        // Complete the ribbon area to create a 3D volumetric band
        for (let x = width; x >= 0; x -= 15) {
          const wave1 = Math.sin(x * ribbon.freq + step * ribbon.speed + 0.3) * ribbon.amp;
          const wave2 = Math.cos(x * ribbon.freq * 0.6 - step * ribbon.speed * 0.7) * (ribbon.amp * 0.4);
          ctx.lineTo(x, baseY + wave1 + wave2 + (28 + index * 10));
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - 60, width, baseY + 60);
        grad.addColorStop(0, ribbon.color1);
        grad.addColorStop(0.5, 'rgba(255, 50, 60, 0.75)');
        grad.addColorStop(1, ribbon.color2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Glowing edge stroke
        ctx.strokeStyle = ribbon.stroke;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      // Render floating light particles
      embers.forEach((ember) => {
        ember.y += ember.vy;
        ember.x += ember.vx;
        if (ember.y < 0) ember.y = height + 10;
        if (ember.x < 0) ember.x = width;
        if (ember.x > width) ember.x = 0;

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 202, 202, ${ember.alpha * 0.8})`;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (isAnimationRunning) {
        step += 1;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isAnimationRunning]);

  const toggleAnimation = () => {
    setIsAnimationRunning((prev) => !prev);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Diseño Tu Espacio, quiero aprovechar el 20% de descuento de Black Friday en Papeles de Colgadura (válido hasta el 30 de noviembre). Me interesa la referencia ${selectedWallpaper.sku} (${selectedWallpaper.name}) con precio de oferta de ${formatPriceCOP(selectedWallpaper.discountPrice)}. ¿Tienen disponibilidad y asesoría?`
  );
  const whatsappUrl = `https://wa.me/573000044784?text=${whatsappMessage}`;

  return (
    <section
      aria-label="Campaña Black Friday Papeles de Colgadura"
      className="relative min-h-[85vh] sm:min-h-[92vh] bg-[#0c0d10] text-white flex items-center justify-center overflow-hidden font-sans select-none border-b border-neutral-800"
    >
      {/* ANIMATED CANVAS BACKGROUND: Ondulaciones de cinta roja 3D sedosa que reemplazan el video anterior */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      {/* Subtle top/bottom editorial gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none z-0"
      />

      {/* Control bar: Pause/Play animation */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20">
        <button
          type="button"
          onClick={toggleAnimation}
          aria-label={isAnimationRunning ? 'Pausar animación de fondo' : 'Reanudar animación'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white border border-neutral-700/80 text-[10px] uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          {isAnimationRunning ? (
            <>
              <Pause className="w-3 h-3 text-red-400" aria-hidden="true" />
              <span className="hidden sm:inline">Pausar Movimiento</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-red-400" aria-hidden="true" />
              <span className="hidden sm:inline">Reanudar</span>
            </>
          )}
        </button>
      </div>

      {/* MAIN CONTAINER: Hero Layout con la Composición Black Friday 3D Ribbon */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: User's Black Friday Ribbon Artwork + Interactive Details */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Badges: Super Sale + Nov 30 Deadline */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-600/25 border border-red-500/50 text-red-300 text-[11px] font-bold uppercase tracking-[0.22em] shadow-sm">
                <Sparkles className="w-3 h-3 text-red-400" aria-hidden="true" />
                Black Friday Sale
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-[11px] uppercase tracking-[0.18em] font-semibold">
                <Clock className="w-3 h-3 text-amber-300" aria-hidden="true" />
                Hasta el 30 de Noviembre
              </span>
            </div>

            {/* THE VISUAL PIECE: Faithful adaptation of the user's uploaded Black Friday Ribbon image */}
            <div className="relative group w-full max-w-lg rounded-2xl overflow-hidden border border-red-500/30 bg-black/70 shadow-[0_15px_40px_rgba(220,38,38,0.25)] transition-transform duration-500 hover:scale-[1.01]">
              <div className="relative aspect-[626/431] w-full overflow-hidden">
                <img
                  src="/images/black_friday_ribbon.jpg"
                  alt="Black Friday - Limited Time Super Sale con cinta roja 3D envolvente"
                  width={626}
                  height={431}
                  decoding="async"
                  className="w-full h-full object-cover select-none filter contrast-105"
                />
                
                {/* Floating ambient glow and red shimmer overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
                />

                {/* Offer pill right on the card */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                      Papeles de Colgadura
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest shadow-md">
                    -20% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Live Countdown Timer to November 30 */}
            <div className="w-full max-w-lg space-y-2">
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-bold block text-center lg:text-left">
                Tiempo restante de la oferta:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Días', val: timeLeft.days },
                  { label: 'Horas', val: timeLeft.hours },
                  { label: 'Min', val: timeLeft.minutes },
                  { label: 'Seg', val: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-neutral-900/90 border border-neutral-700/70 rounded-xl py-2 px-1 backdrop-blur-md"
                  >
                    <div className="text-xl sm:text-2xl font-serif text-white font-bold tabular-nums">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.16em] text-neutral-400 font-medium">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Offer Pitch, Interactive Texture Explorer & Direct WhatsApp CTA */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-red-400 font-bold block">
                Campaña Oficial de Autor
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight tracking-tight">
                Todos nuestros papeles de colgadura con un{' '}
                <span className="font-bold text-red-400 underline decoration-red-500/60 underline-offset-8">
                  20% de descuento
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Lleva la alta decoración a tus muros con texturas vinílicas arquitectónicas de alto
                gramaje, lavables y con relieve táctil. Cada rollo cubre hasta{' '}
                <strong className="text-white font-medium">16.5 m²</strong>. Elige tu referencia
                favorita y cotiza al instante por WhatsApp.
              </p>
            </div>

            {/* INTERACTIVE TEXTURE EXPLORER CARD */}
            <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                  Explorador de Texturas en Oferta
                </span>
                <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">
                  Ahorras $160.000 por rollo
                </span>
              </div>

              {/* Selected Texture Details */}
              <div className="flex items-center gap-4 bg-black/60 border border-neutral-800 rounded-xl p-3">
                <img
                  src={selectedWallpaper.image}
                  alt={selectedWallpaper.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="w-20 h-20 rounded-lg object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold">
                      Ref. {selectedWallpaper.sku}
                    </span>
                    <span className="text-[10px] text-neutral-400 truncate">
                      {selectedWallpaper.collection}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">
                    {selectedWallpaper.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-red-400">
                      {formatPriceCOP(selectedWallpaper.discountPrice)}
                    </span>
                    <span className="text-xs text-neutral-500 line-through">
                      {formatPriceCOP(selectedWallpaper.regularPrice)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">
                      20% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Reference Selector Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Toca una referencia para consultar:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {WALLPAPER_PREVIEWS.map((item) => {
                    const isSelected = item.sku === selectedWallpaper.sku;
                    return (
                      <button
                        key={item.sku}
                        type="button"
                        onClick={() => setSelectedWallpaper(item)}
                        className={`rounded-lg p-1.5 text-center transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/30'
                            : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-600 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.sku}
                          width={80}
                          height={50}
                          loading="lazy"
                          className="w-full h-8 object-cover rounded mb-1"
                        />
                        <span className="text-[9px] font-mono font-bold text-white block truncate">
                          {item.sku}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
                  <span>Rollo 1.06m × 15.6m (16.5m²)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
                  <span>Vinílico lavable alto tráfico</span>
                </div>
              </div>

            </div>

            {/* CALLS TO ACTION: WhatsApp 3000044784 + Catalog Link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-bold text-xs uppercase tracking-[0.16em] shadow-lg shadow-[#25D366]/25 transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4 fill-neutral-950" aria-hidden="true" />
                <span>Pedir 20% OFF por WhatsApp</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>

              <Link
                to="/catalog?category=Papel de Colgadura"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-[0.16em] transition-all"
              >
                <Tag className="w-4 h-4" aria-hidden="true" />
                <span>Ver Catálogo</span>
              </Link>
            </div>

            {/* Contact Note */}
            <p className="text-[11px] text-neutral-400 text-center lg:text-left">
              Línea directa WhatsApp: <strong className="text-white">+57 300 004 4784</strong> • Atención inmediata y cálculo de rollos para tu proyecto.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};
