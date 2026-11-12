import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
  Tag,
  Video,
} from 'lucide-react';

interface WallpaperSample {
  id: string;
  sku: string;
  name: string;
  collection: string;
  finish: string;
  dimensions: string;
  regularPrice: number;
  discountPrice: number;
  image: string;
  accentColor: string;
}

const WALLPAPER_SAMPLES: WallpaperSample[] = [
  {
    id: 'prod_papel_md681511',
    sku: 'MD681511',
    name: 'Textura Lino Arquitectónico Arena',
    collection: 'Serie Textil Contemporánea',
    finish: 'Vinílico lavable • Relieve orgánico mate',
    dimensions: 'Rollo 1.06 m × 15.6 m (16.5 m²)',
    regularPrice: 800000,
    discountPrice: 640000,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD681511_2.jpeg',
    accentColor: '#d6c7b2',
  },
  {
    id: 'prod_papel_md680313',
    sku: 'MD680313',
    name: 'Trama Piedra Caliza & Seda',
    collection: 'Colección Mineral Luxury',
    finish: 'Textura táctil de alto tráfico • Mate',
    dimensions: 'Rollo 1.06 m × 15.6 m (16.5 m²)',
    regularPrice: 800000,
    discountPrice: 640000,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680313_1.jpeg',
    accentColor: '#b9b4ab',
  },
  {
    id: 'prod_papel_md680101',
    sku: 'MD680101',
    name: 'Estuco Veneciano Gris Grafito',
    collection: 'Línea Minimalismo Monolítico',
    finish: 'Acabado arquitectónico profundo',
    dimensions: 'Rollo 1.06 m × 15.6 m (16.5 m²)',
    regularPrice: 800000,
    discountPrice: 640000,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680101_2.jpeg',
    accentColor: '#7d8082',
  },
  {
    id: 'prod_papel_md680402b',
    sku: 'MD680402B',
    name: 'Fibra Botánica Dorada & Carbón',
    collection: 'Edición Especial de Autor',
    finish: 'Veta satinada con contraste cálido',
    dimensions: 'Rollo 1.06 m × 15.6 m (16.5 m²)',
    regularPrice: 800000,
    discountPrice: 640000,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/papel_oficial_MD680402B_1.jpeg',
    accentColor: '#c9a66b',
  },
];

const VIDEO_SCENES = [
  {
    id: 'santa-marta',
    label: 'Ambiente Casa Santa Marta',
    src: '/videos/casa_santa_marta.mp4',
  },
  {
    id: 'interior-tour',
    label: 'Recorrido Interior de Autor',
    src: '/videos/house_interior_tour.mp4',
  },
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getBlackFridayDeadline = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  // November is month index 10 (0-based). Deadline: Nov 30, 23:59:59 local time
  const target = new Date(year, 10, 30, 23, 59, 59).getTime();
  if (now.getTime() > target) {
    return new Date(year + 1, 10, 30, 23, 59, 59).getTime();
  }
  return target;
};

const formatCOP = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

export const BlackFridayVideoBanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedSample, setSelectedSample] = useState<WallpaperSample>(WALLPAPER_SAMPLES[0]);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [rollsCount, setRollsCount] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 18,
    hours: 12,
    minutes: 45,
    seconds: 0,
  });

  // Countdown timer until November 30
  useEffect(() => {
    const deadline = getBlackFridayDeadline();

    const updateTimer = () => {
      const diff = Math.max(0, deadline - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Respect prefers-reduced-motion before autoplaying background video
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (!videoRef.current) return;
      if (event.matches) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, [activeSceneIndex]);

  const toggleVideoPlayback = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const totalRegular = selectedSample.regularPrice * rollsCount;
  const totalDiscounted = selectedSample.discountPrice * rollsCount;
  const totalSavings = totalRegular - totalDiscounted;
  const totalCoverage = (rollsCount * 16.5).toFixed(1);

  const whatsappMessage = encodeURIComponent(
    `Hola Diseño Tu Espacio, quiero aprovechar el Black Friday (20% OFF hasta el 30 de noviembre) en Papeles de Colgadura. Me interesa la referencia ${selectedSample.sku} (${selectedSample.name}) por ${rollsCount} ${
      rollsCount === 1 ? 'rollo' : 'rollos'
    } (${formatCOP(totalDiscounted)} con descuento). ¿Me brindan asesoría?`
  );
  const whatsappUrl = `https://wa.me/573000044784?text=${whatsappMessage}`;

  return (
    <section
      aria-label="Campaña Black Friday Papeles de Colgadura"
      className="max-w-7xl mx-auto px-4 sm:px-6"
    >
      <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
        {/* Background Video with explicit dimensions, poster, muted, aria-hidden, and lazy loading */}
        <video
          ref={videoRef}
          key={VIDEO_SCENES[activeSceneIndex].src}
          src={VIDEO_SCENES[activeSceneIndex].src}
          poster="/images/cat_pared_1787548067893.jpg"
          width={1600}
          height={900}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          {...({ loading: 'lazy' } as React.VideoHTMLAttributes<HTMLVideoElement>)}
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-[1.02] transition-opacity duration-700 pointer-events-none"
        />

        {/* Editorial multi-layer dark & warm gold gradient overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/65 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,192,177,0.18),transparent_55%)] pointer-events-none"
        />

        {/* Top bar: Campaign status + Video controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 sm:px-10 pt-6 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/40 text-amber-200 text-[10px] font-bold uppercase tracking-[0.22em]">
              <Sparkles className="w-3 h-3 text-amber-300" aria-hidden="true" />
              Black Friday Architectural Edition
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-[10px] uppercase tracking-[0.18em] font-semibold">
              <Clock className="w-3 h-3 text-[#81c0b1]" aria-hidden="true" />
              Válido hasta el 30 de Noviembre
            </span>
          </div>

          {/* Interactive Video Scene Switcher & Play/Pause Control */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-black/50 backdrop-blur-md border border-white/15 rounded-full p-0.5">
              {VIDEO_SCENES.map((scene, index) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneIndex(index)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest transition-all ${
                    activeSceneIndex === index
                      ? 'bg-white text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Video className="w-3 h-3" aria-hidden="true" />
                    {scene.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleVideoPlayback}
              aria-label={isPlaying ? 'Pausar video de fondo' : 'Reproducir video de fondo'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-[#81c0b1]" aria-hidden="true" />
                  <span>Pausar Video</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#81c0b1]" aria-hidden="true" />
                  <span>Reproducir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-10 items-center">
          {/* Left Column: Campaign Story, Countdown & WhatsApp CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#81c0b1] font-semibold">
                Revestimientos & Texturas de Pared
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif text-white leading-[1.1] tracking-tight">
                Todos Nuestros Papeles de Colgadura con{' '}
                <span className="italic font-normal text-amber-200 underline decoration-amber-400/50 underline-offset-8">
                  20% de Descuento
                </span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl leading-relaxed">
                Transforma muros residenciales y comerciales con texturas vinílicas de alto gramaje,
                relieve orgánico y acabado arquitectónico mate. Selecciona tu textura favorita en el
                simulador interactivo y asegura tu descuento de Black Friday antes del{' '}
                <strong className="text-white font-medium">30 de noviembre</strong>.
              </p>
            </div>

            {/* Live Countdown to Nov 30 */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">
                Cierre de Campaña: 30 de Noviembre • 11:59 PM
              </span>
              <div className="grid grid-cols-4 gap-2.5 max-w-md">
                {[
                  { value: timeLeft.days, label: 'Días' },
                  { value: timeLeft.hours, label: 'Horas' },
                  { value: timeLeft.minutes, label: 'Minutos' },
                  { value: timeLeft.seconds, label: 'Segundos' },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="bg-white/5 backdrop-blur-md border border-white/15 rounded-xl py-2.5 px-3 text-center"
                  >
                    <div className="text-xl sm:text-2xl font-serif text-white font-semibold tabular-nums">
                      {String(unit.value).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.18em] text-neutral-400 mt-0.5">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-neutral-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-[#81c0b1] shrink-0" aria-hidden="true" />
                <span>Rollo XXL de 16.5 m²</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-[#81c0b1] shrink-0" aria-hidden="true" />
                <span>Ahorras $160.000 por rollo</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-[#81c0b1] shrink-0" aria-hidden="true" />
                <span>Asesoría por WhatsApp</span>
              </div>
            </div>

            {/* Primary Call To Action -> Official WhatsApp 3000044784 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-bold text-xs uppercase tracking-[0.18em] shadow-lg shadow-[#25D366]/25 transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4 fill-neutral-950" aria-hidden="true" />
                <span>Reclamar 20% OFF por WhatsApp</span>
                <ArrowUpRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <Link
                to="/catalog?category=Papel de Colgadura"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-[0.18em] transition-all"
              >
                <span>Ver las 51 Referencias</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Texture Selector & Roll Calculator Card */}
          <div className="lg:col-span-5">
            <div className="bg-black/65 backdrop-blur-xl border border-white/15 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold block">
                    Explorador Interactivo
                  </span>
                  <h3 className="text-base font-serif text-white">
                    Selecciona una Textura & Cotiza en Vivo
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-400 text-neutral-950 text-[11px] font-extrabold uppercase tracking-wider">
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  -20% OFF
                </span>
              </div>

              {/* Selected Wallpaper Live Preview */}
              <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden border border-white/15 bg-neutral-900">
                <img
                  src={selectedSample.image}
                  alt={`Papel de Colgadura ${selectedSample.sku} - ${selectedSample.name}`}
                  width={600}
                  height={400}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest border border-white/15">
                    Ref. {selectedSample.sku}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#81c0b1]/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider">
                    {selectedSample.collection}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-white">
                      {selectedSample.name}
                    </h4>
                    <p className="text-[11px] text-neutral-300">{selectedSample.finish}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-neutral-400 line-through block">
                      {formatCOP(selectedSample.regularPrice)}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-amber-300">
                      {formatCOP(selectedSample.discountPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Texture Swatch Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-bold block">
                  Cambiar Referencia Destacada:
                </span>
                <div className="grid grid-cols-4 gap-2.5">
                  {WALLPAPER_SAMPLES.map((sample) => {
                    const isSelected = sample.id === selectedSample.id;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setSelectedSample(sample)}
                        className={`group relative rounded-lg overflow-hidden border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-300 ring-2 ring-amber-300/40 scale-[1.02]'
                            : 'border-white/15 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={sample.image}
                          alt={sample.sku}
                          width={140}
                          height={90}
                          loading="lazy"
                          className="w-full h-12 object-cover"
                        />
                        <div className="p-1.5 bg-neutral-900/95 text-center">
                          <span className="text-[9px] font-mono font-bold text-white block truncate">
                            {sample.sku}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Roll Estimator */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                      Calculadora de Proyecto
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Cobertura estimada: <strong className="text-white">{totalCoverage} m²</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setRollsCount(count)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          rollsCount === count
                            ? 'bg-amber-300 text-neutral-950'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {count}R
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Total Black Friday ({rollsCount} {rollsCount === 1 ? 'rollo' : 'rollos'}):</span>
                    <span className="text-amber-300 font-bold text-base">
                      {formatCOP(totalDiscounted)}
                    </span>
                    <span className="text-neutral-500 line-through ml-2 text-xs">
                      {formatCOP(totalRegular)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#81c0b1] font-bold block">
                      Tu Ahorro Directo
                    </span>
                    <span className="text-sm font-bold text-white">
                      -{formatCOP(totalSavings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Reservation Link for Selected Sample */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-amber-200 text-neutral-950 font-bold text-[11px] uppercase tracking-[0.18em] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Reservar Ref. {selectedSample.sku} con 20% OFF en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
