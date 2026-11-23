import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

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

    const flakeCount = width < 768 ? 40 : 75;
    const flakes: Snowflake[] = Array.from({ length: flakeCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1.2,
      speedY: Math.random() * 0.8 + 0.35,
      speedX: (Math.random() - 0.5) * 0.28,
      swayAmp: Math.random() * 0.55 + 0.2,
      swayFreq: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.35,
      isGold: idx % 5 === 0,
    }));

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
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
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
