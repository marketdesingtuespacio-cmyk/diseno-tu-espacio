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
  Gift,
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
    regularPrice: 600000,
    discountPrice: 480000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD681511_2.jpeg',
  },
  {
    sku: 'MD680313',
    name: 'Piedra Caliza & Seda',
    collection: 'Colección Mineral Luxury',
    regularPrice: 600000,
    discountPrice: 480000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680313_1.jpeg',
  },
  {
    sku: 'MD680101',
    name: 'Estuco Gris Grafito',
    collection: 'Minimalismo Monolítico',
    regularPrice: 600000,
    discountPrice: 480000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680101_2.jpeg',
  },
  {
    sku: 'MD680402B',
    name: 'Fibra Botánica & Carbón',
    collection: 'Edición Especial de Autor',
    regularPrice: 600000,
    discountPrice: 480000,
    image:
      'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680402B_1.jpeg',
  },
];

const getChristmasDeadline = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  // Month 11 = December (0-indexed). Target: Dec 24, 23:59:59 (Nochebuena / Navidad)
  const target = new Date(year, 11, 24, 23, 59, 59).getTime();
  if (now.getTime() > target) {
    return new Date(year + 1, 11, 24, 23, 59, 59).getTime();
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
  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 25,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  // Countdown timer to Christmas Eve (Nochebuena)
  useEffect(() => {
    const deadline = getChristmasDeadline();

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

  // Canvas animation: Fluid 3D Christmas Red, Pine Emerald & Gold Silk Ribbons + Snowflakes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 780);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let step = 0;

    // Festive Christmas Silk Ribbons: Royal Crimson, Forest Emerald, and Champagne Gold
    const ribbons = [
      {
        yRatio: 0.32,
        speed: 0.012,
        amp: 55,
        freq: 0.003,
        color1: 'rgba(185, 28, 28, 0.55)',
        color2: 'rgba(127, 29, 29, 0.2)',
        midColor: 'rgba(220, 38, 38, 0.78)',
        stroke: 'rgba(251, 191, 36, 0.75)',
      },
      {
        yRatio: 0.52,
        speed: 0.015,
        amp: 72,
        freq: 0.0025,
        color1: 'rgba(15, 76, 46, 0.6)',
        color2: 'rgba(6, 46, 26, 0.25)',
        midColor: 'rgba(21, 128, 61, 0.65)',
        stroke: 'rgba(253, 224, 71, 0.85)',
      },
      {
        yRatio: 0.72,
        speed: 0.01,
        amp: 60,
        freq: 0.0035,
        color1: 'rgba(217, 119, 6, 0.42)',
        color2: 'rgba(153, 27, 27, 0.2)',
        midColor: 'rgba(245, 158, 11, 0.55)',
        stroke: 'rgba(254, 240, 138, 0.7)',
      },
    ];

    // Christmas Snowflakes & Golden Sparks inside Hero
    const particles = Array.from({ length: 42 }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.6 + 0.9,
      vx: (Math.random() - 0.5) * 0.45,
      vy: Math.random() * 0.65 + 0.25,
      alpha: Math.random() * 0.65 + 0.35,
      isGold: idx % 2 === 0,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep pine-emerald and crimson Christmas night gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.42,
        40,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(68, 12, 20, 0.55)');
      bgGrad.addColorStop(0.5, 'rgba(9, 34, 22, 0.82)');
      bgGrad.addColorStop(1, 'rgba(6, 15, 11, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw undulating 3D Christmas silk ribbons
      ribbons.forEach((ribbon, index) => {
        const baseY = height * ribbon.yRatio;
        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= width; x += 15) {
          const wave1 = Math.sin(x * ribbon.freq + step * ribbon.speed) * ribbon.amp;
          const wave2 =
            Math.cos(x * ribbon.freq * 0.6 - step * ribbon.speed * 0.7) * (ribbon.amp * 0.4);
          ctx.lineTo(x, baseY + wave1 + wave2);
        }

        for (let x = width; x >= 0; x -= 15) {
          const wave1 = Math.sin(x * ribbon.freq + step * ribbon.speed + 0.3) * ribbon.amp;
          const wave2 =
            Math.cos(x * ribbon.freq * 0.6 - step * ribbon.speed * 0.7) * (ribbon.amp * 0.4);
          ctx.lineTo(x, baseY + wave1 + wave2 + (30 + index * 10));
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - 60, width, baseY + 60);
        grad.addColorStop(0, ribbon.color1);
        grad.addColorStop(0.5, ribbon.midColor);
        grad.addColorStop(1, ribbon.color2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Golden festive edge trim
        ctx.strokeStyle = ribbon.stroke;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      // Render drifting Christmas snow & golden stars
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y > height + 10) p.y = -10;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isGold) {
          ctx.fillStyle = `rgba(253, 224, 71, ${p.alpha})`;
          ctx.shadowColor = '#f59e0b';
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = '#ffffff';
        }
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
    `Hola Diseño Tu Espacio 🎄, quiero aprovechar la promoción Especial de Navidad en Papeles de Colgadura a $480.000. Me interesa la referencia ${selectedWallpaper.sku} (${selectedWallpaper.name}). ¿Tienen disponibilidad y asesoría?`
  );
  const whatsappUrl = `https://wa.me/573113477785?text=${whatsappMessage}`;

  return (
    <section
      aria-label="Especial de Navidad y Fin de Año en Diseño Tu Espacio"
      className="relative min-h-[88vh] sm:min-h-[94vh] bg-[#071710] text-white flex items-center justify-center overflow-hidden font-sans select-none border-b-2 border-amber-500/40 pt-28 sm:pt-36"
    >
      {/* ANIMATED CANVAS BACKGROUND: Cintas Navideñas 3D (Rojo, Verde Pino y Oro) + Copos de Nieve */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90"
      />

      {/* Subtle top/bottom editorial gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#06140e]/95 pointer-events-none z-0"
      />

      {/* Decorative Hanging Christmas Ornaments (Top Left & Top Right) */}
      <div
        aria-hidden="true"
        className="hidden xl:flex flex-col items-center absolute top-28 left-10 z-10 pointer-events-none christmas-ornament-sway"
      >
        <div className="w-[1.5px] h-16 bg-gradient-to-b from-amber-300/40 to-amber-400" />
        <svg viewBox="0 0 64 64" className="w-14 h-14 drop-shadow-[0_8px_20px_rgba(220,38,38,0.5)]">
          <rect x="26" y="4" width="12" height="6" rx="2" fill="#fbbf24" />
          <circle cx="32" cy="36" r="24" fill="url(#redBauble)" stroke="#fbbf24" strokeWidth="2" />
          <path d="M12 36 Q32 24 52 36" fill="none" stroke="#fde047" strokeWidth="2" />
          <circle cx="24" cy="26" r="4" fill="rgba(255,255,255,0.45)" />
          <defs>
            <radialGradient id="redBauble" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#450a0a" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="hidden xl:flex flex-col items-center absolute top-28 right-12 z-10 pointer-events-none christmas-ornament-sway"
        style={{ animationDelay: '1.2s' }}
      >
        <div className="w-[1.5px] h-24 bg-gradient-to-b from-amber-300/40 to-amber-400" />
        <svg viewBox="0 0 64 64" className="w-16 h-16 drop-shadow-[0_8px_20px_rgba(245,158,11,0.45)]">
          <rect x="26" y="4" width="12" height="6" rx="2" fill="#fbbf24" />
          <circle cx="32" cy="36" r="24" fill="url(#goldBauble)" stroke="#fef08a" strokeWidth="2" />
          <path d="M10 34 L54 34 M14 42 L50 42" stroke="#78350f" strokeWidth="1.5" opacity="0.4" />
          <circle cx="23" cy="25" r="5" fill="rgba(255,255,255,0.6)" />
          <defs>
            <radialGradient id="goldBauble" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#713f12" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Control bar: Pause/Play animation (WCAG 2.2.2 compliant; visible label matches accessible name, no aria-pressed) */}
      <div className="absolute top-32 right-4 sm:top-36 sm:right-8 z-20">
        <button
          type="button"
          onClick={toggleAnimation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/90 text-amber-100 hover:text-white border border-amber-400/50 text-[10px] uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          {isAnimationRunning ? (
            <>
              <Pause className="w-3 h-3 text-amber-300" aria-hidden="true" />
              <span>Pausar Movimiento</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-amber-300" aria-hidden="true" />
              <span>Reanudar Movimiento</span>
            </>
          )}
        </button>
      </div>

      {/* MAIN CONTAINER: Hero Layout con Decoración Navideña de Lujo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Christmas Ribbon Artwork + Holiday Countdown */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Festive Christmas Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#8b0d18] to-[#b91c1c] border border-amber-400/70 text-amber-100 text-[11px] font-bold uppercase tracking-[0.2em] shadow-md">
                <Gift className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                🎄 Especial de Navidad
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 text-emerald-200 text-[11px] uppercase tracking-[0.18em] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                Temporada Festiva 2026
              </span>
            </div>

            {/* THE VISUAL PIECE: Christmas Gold & Crimson Framed Showcase */}
            <div className="relative group w-full max-w-lg rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-black/75 shadow-[0_18px_50px_rgba(220,38,38,0.3)] transition-transform duration-500 hover:scale-[1.01]">
              
              {/* Top Festive Garland Strip inside Card */}
              <div className="bg-gradient-to-r from-[#6e0d18] via-[#0e3a24] to-[#6e0d18] px-4 py-2 border-b border-amber-400/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-amber-200">
                <span>🎄 Colección Navideña de Autor</span>
                <span className="text-amber-300">✨ Regala Diseño ✨</span>
              </div>

              <div className="relative aspect-[626/431] w-full overflow-hidden">
                <img
                  src="/images/black_friday_ribbon.jpg"
                  alt="Campaña Festiva de Navidad con cinta roja 3D envolvente en Diseño Tu Espacio"
                  width={626}
                  height={431}
                  decoding="async"
                  className="w-full h-full object-cover select-none filter contrast-105"
                />

                {/* Golden Christmas Corner Wreath Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#06180f]/90 via-transparent to-black/30 pointer-events-none"
                />

                {/* Top-Left Christmas Holly & Star Emblem */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0b2919]/90 border border-amber-400/60 text-amber-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-md">
                  <span aria-hidden="true">🎅</span>
                  <span>Hogar Listo para Navidad</span>
                </div>

                {/* Offer pill right on the card */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#092216]/95 via-black/90 to-[#5e0b15]/95 backdrop-blur-md border border-amber-400/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">
                      🎁 Papeles de Colgadura • Bono Navideño
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-extrabold text-xs uppercase tracking-widest shadow-md">
                    -20% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Live Countdown Timer to Christmas Eve (Nochebuena) */}
            <div className="w-full max-w-lg space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] uppercase tracking-[0.22em] text-amber-300 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                <span>Cuenta regresiva para Nochebuena (24 Dic):</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Días', val: timeLeft.days },
                  { label: 'Horas', val: timeLeft.hours },
                  { label: 'Min', val: timeLeft.minutes },
                  { label: 'Seg', val: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gradient-to-b from-[#0f2e1e]/90 to-[#081a11]/95 border border-amber-400/40 rounded-xl py-2.5 px-1 backdrop-blur-md shadow-inner"
                  >
                    <div className="text-xl sm:text-2xl font-serif text-amber-200 font-bold tabular-nums">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.16em] text-emerald-300/90 font-semibold">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Christmas Offer Pitch, Interactive Texture Explorer & Direct WhatsApp CTA */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold block">
                🎄 Magia, Luz &amp; Alta Decoración en tus Espacios
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight tracking-tight">
                Estrena muros esta Navidad con papeles de colgadura a{' '}
                <span className="font-bold text-amber-300 underline decoration-red-500/80 underline-offset-8">
                  $480.000
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Recibe a tu familia en un hogar completamente renovado para las cenas y celebraciones decembrinas. Texturas vinílicas arquitectónicas de alto gramaje, lavables y con relieve táctil. Cada rollo cubre hasta{' '}
                <strong className="text-amber-300 font-semibold">16.5 m²</strong> con precio especial festivo (-20% OFF).
              </p>
            </div>

            {/* INTERACTIVE TEXTURE EXPLORER CARD - CHRISTMAS EDITION */}
            <div className="bg-gradient-to-b from-[#0d261a]/95 to-[#091811]/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl p-5 space-y-4 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                  <span aria-hidden="true">🎄</span>
                  <span>Catálogo Festivo de Texturas</span>
                </span>
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider bg-red-900/60 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  🎁 Bono Navidad: -$120.000
                </span>
              </div>

              {/* Selected Texture Details */}
              <div className="flex items-center gap-4 bg-black/55 border border-amber-400/30 rounded-xl p-3">
                <img
                  src={selectedWallpaper.image}
                  alt={selectedWallpaper.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="w-20 h-20 rounded-lg object-cover border border-amber-400/50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-red-700/40 border border-amber-400/50 text-amber-200 text-[10px] font-mono font-bold">
                      Ref. {selectedWallpaper.sku}
                    </span>
                    <span className="text-[10px] text-emerald-200/80 truncate">
                      {selectedWallpaper.collection}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">
                    {selectedWallpaper.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-amber-300">
                      {formatPriceCOP(selectedWallpaper.discountPrice)}
                    </span>
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPriceCOP(selectedWallpaper.regularPrice)}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">
                      🎄 Precio Navidad
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Reference Selector Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-semibold block">
                  Elige tu textura favorita para cotizar tu regalo de Navidad:
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
                            ? 'bg-red-950/80 border-amber-400 ring-2 ring-amber-400/40'
                            : 'bg-black/50 border-emerald-900 hover:border-amber-400/50 opacity-80 hover:opacity-100'
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
                        <span className="text-[9px] font-mono font-bold text-amber-100 block truncate">
                          {item.sku}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
                  <span>Rollo 1.06m × 15.6m (16.5m²)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
                  <span>Entrega inmediata para Navidad</span>
                </div>
              </div>

            </div>

            {/* CALLS TO ACTION: WhatsApp 3113477785 + Catalog Link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#991b1b] hover:from-[#dc2626] hover:to-[#b91c1c] text-white border border-amber-300/60 font-bold text-xs uppercase tracking-[0.16em] shadow-lg shadow-red-900/50 transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4 fill-amber-300 text-amber-300" aria-hidden="true" />
                <span>🎄 Pedir Oferta Navideña ($480.000)</span>
                <ArrowRight
                  className="w-4 h-4 text-amber-300 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>

              <Link
                to="/catalog?category=Papel de Colgadura"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs uppercase tracking-[0.16em] transition-all shadow-md"
              >
                <Tag className="w-4 h-4" aria-hidden="true" />
                <span>Ver Catálogo</span>
              </Link>
            </div>

            {/* Contact Note */}
            <p className="text-[11px] text-emerald-200/80 text-center lg:text-left">
              🎄 Línea de Asesoría Navideña WhatsApp: <strong className="text-amber-300">+57 311 347 7785</strong> • Atención inmediata en Medellín y envíos a toda Colombia.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};
