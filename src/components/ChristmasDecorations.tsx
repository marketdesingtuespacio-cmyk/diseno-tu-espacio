import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Sparkles, Gift } from 'lucide-react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  opacity: number;
  isGold: boolean;
}

export const ChristmasDecorations: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isSnowing, setIsSnowing] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const flakeCount = width < 768 ? 48 : 85;
    const flakes: Snowflake[] = Array.from({ length: flakeCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.2 + 1.2,
      speedY: Math.random() * 0.85 + 0.35,
      speedX: (Math.random() - 0.5) * 0.3,
      swayAmp: Math.random() * 0.6 + 0.2,
      swayFreq: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.55 + 0.35,
      isGold: idx % 5 === 0,
    }));

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isSnowing) {
        tick += 1;
        for (const f of flakes) {
          f.y += f.speedY;
          f.x += f.speedX + Math.sin(tick * f.swayFreq + f.phase) * f.swayAmp;

          if (f.y > height + 10) {
            f.y = -10;
            f.x = Math.random() * width;
          }
          if (f.x > width + 10) f.x = -10;
          if (f.x < -10) f.x = width + 10;

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          if (f.isGold) {
            ctx.fillStyle = `rgba(245, 197, 66, ${f.opacity})`;
            ctx.shadowColor = 'rgba(245, 197, 66, 0.7)';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 6;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
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
  }, [isSnowing]);

  // Decorative bulb definitions along the top of the screen
  const lightBulbs = Array.from({ length: 22 }, (_, i) => {
    const colors = [
      { fill: '#ef4444', glow: 'rgba(239,68,68,0.75)' },   // Crimson Red
      { fill: '#fbbf24', glow: 'rgba(251,191,36,0.85)' },  // Warm Gold
      { fill: '#22c55e', glow: 'rgba(34,197,94,0.75)' },   // Pine Emerald
      { fill: '#fef08a', glow: 'rgba(254,240,138,0.9)' },  // Fairy Warm White
    ];
    return {
      id: i,
      ...colors[i % colors.length],
      delay: `${(i % 4) * 0.45}s`,
    };
  });

  return (
    <>
      {/* 1. FULL-VIEWPORT SNOWFALL & GOLDEN STARDUST CANVAS */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* 2. HANGING CHRISTMAS FAIRY LIGHTS GARLAND (FIXED AT TOP BELOW HEADER) */}
      <div
        aria-hidden="true"
        className="fixed top-[112px] md:top-[126px] lg:top-[132px] left-0 right-0 z-30 pointer-events-none overflow-hidden select-none"
      >
        {/* Pine & Gold Cord */}
        <div className="w-full h-1 bg-gradient-to-r from-[#0f3823] via-[#b91c1c] to-[#0f3823] opacity-90 shadow-sm" />

        {/* Hanging Fairy Lights Row */}
        <div className="max-w-[1600px] mx-auto px-2 flex justify-between items-start">
          {lightBulbs.map((bulb) => (
            <div
              key={bulb.id}
              className="flex flex-col items-center"
              style={{
                animationDelay: bulb.delay,
              }}
            >
              {/* Cord drop */}
              <div className="w-[1.5px] h-2.5 sm:h-3.5 bg-emerald-950/70" />
              {/* Gold Socket */}
              <div className="w-2 h-1 bg-amber-500 rounded-t-xs" />
              {/* Glowing Bulb */}
              <div
                className="w-2.5 h-3.5 sm:w-3 sm:h-4 rounded-full christmas-bulb-glow"
                style={{
                  backgroundColor: bulb.fill,
                  boxShadow: `0 0 10px 2px ${bulb.glow}`,
                  animationDelay: bulb.delay,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. ACCESSIBLE FLOATING CHRISTMAS CONTROL PILL (BOTTOM LEFT) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 print:hidden">
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#0b2919] via-[#133b26] to-[#5e0b15] text-white pl-3 pr-2 py-1.5 rounded-full shadow-xl border border-amber-400/50 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100 hidden sm:inline">
            Ambiente Navideño
          </span>
          <button
            type="button"
            onClick={() => setIsSnowing((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/70 text-[10px] font-bold uppercase tracking-wider text-white border border-amber-300/30 transition-colors cursor-pointer"
          >
            {isSnowing ? (
              <>
                <Pause className="w-3 h-3 text-amber-300" aria-hidden="true" />
                <span>Pausar Nieve</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-amber-300" aria-hidden="true" />
                <span>Activar Nieve</span>
              </>
            )}
          </button>
        </div>

        <a
          href="https://wa.me/573113477785?text=Hola%20Dise%C3%B1o%20Tu%20Espacio%2C%20quiero%20conocer%20las%20promociones%20y%20colecciones%20de%20Navidad."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#8b0d18] hover:bg-[#a6101e] text-white text-[10px] font-bold uppercase tracking-wider border border-amber-400/50 shadow-lg transition-transform hover:scale-105"
        >
          <Gift className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
          <span>Regalos Navidad</span>
        </a>
      </div>
    </>
  );
};
