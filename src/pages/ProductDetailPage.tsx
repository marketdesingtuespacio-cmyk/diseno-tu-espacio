import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ShieldCheck,
  Share2,
  Sparkles,
  MapPin,
  Ruler,
  FileText,
  Box,
  Eye,
  Lock
} from 'lucide-react';
import { Product, ProductReviewStats } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { ProductReviewsSection } from '../components/ProductReviewsSection';
import { trackingService } from '../services/trackingService';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bogotá D.C.');

  const [reviewStats, setReviewStats] = useState<ProductReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Accordion Expandable States (Kave Home style)
  const [openSection, setOpenSection] = useState<'dimensions' | 'details' | 'sustainability' | 'shipping' | 'care' | null>('details');

  const { addToCart } = useCart();
  const { formatPrice, language } = useCurrency();
  const { isAuthenticated } = useAuth();

  // City delivery times matrix (days)
  const cityDeliveryDays: Record<string, { min: number; max: number }> = {
    'Bogotá D.C.': { min: 1, max: 2 },
    'Medellín': { min: 2, max: 3 },
    'Cali': { min: 2, max: 4 },
    'Barranquilla': { min: 3, max: 5 },
    'Bucaramanga': { min: 3, max: 5 },
    'Eje Cafetero': { min: 2, max: 4 },
    'Resto del país': { min: 4, max: 6 }
  };

  const getEstimatedDates = (city: string) => {
    const days = cityDeliveryDays[city] || { min: 2, max: 4 };
    const today = new Date();
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + days.min);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + days.max);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return `${minDate.toLocaleDateString('es-CO', options)} - ${maxDate.toLocaleDateString('es-CO', options)}`;
  };

  // Scroll listener for Mobile Sticky Bottom CTA Bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (slug) {
      // 1. Instant synchronous lookup from memory/local storage (0ms delay)
      const syncProd = productService.getProductBySlugSync(slug);
      if (syncProd) {
        setProduct(syncProd);
        const syncRelated = productService.getProductsSync().filter(p => p.id !== syncProd.id).slice(0, 4);
        setRelatedProducts(syncRelated);
        setLoading(false);
      } else {
        setLoading(true);
      }

      // 2. Background async refresh/verification
      productService.getProductBySlug(slug).then(res => {
        if (res) {
          setProduct(res);
          productService.getProducts().then(all => {
            setRelatedProducts(all.filter(p => p.id !== res.id).slice(0, 4));
          });
        }
        setLoading(false);
      });
    }
  }, [slug]);

  // Track Meta Pixel ViewContent & Google Analytics view_item
  useEffect(() => {
    if (product) {
      trackingService.trackViewItem(product);
    }
  }, [product?.id]);

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-20">
        <div className="h-[600px] bg-brand-surface animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light">Pieza No Encontrada</h2>
        <p className="text-xs text-neutral-500">El producto solicitado no está disponible en este momento.</p>
        <Link to="/catalog" className="inline-block bg-brand-black text-white text-xs uppercase font-bold tracking-widest py-3 px-6 rounded-xl hover:bg-neutral-800 transition-colors">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : ['/images/lampara_bowie_1786563431628.jpg'];

  const topTwoImages = imagesList.slice(0, 2);
  const remainingImages = imagesList.slice(2);

  const swatches = (product.colors && product.colors.length > 0) ? product.colors : [];
  const selectedSwatch = swatches[selectedColorIndex] || swatches[0];

  // Financing installment (3 interest-free payments)
  const installmentAmount = Math.round(product.price / 3);

  // WhatsApp Interior Advisor chat pre-filled link
  const whatsappAdvisorLink = `https://wa.me/573113477785?text=${encodeURIComponent(
    `Hola Diseño Tu Espacio, me interesa la pieza "${product.name}" (${product.sku ? `Ref: ${product.sku}` : ''}) y me gustaría recibir asesoría de interiorismo y disponibilidad.`
  )}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div className="max-w-[1650px] mx-auto px-3 sm:px-6 lg:px-10 pt-3 pb-16 space-y-10 font-sans antialiased text-neutral-900">
      
      {/* 1. TOP BREADCRUMB & SOCIAL ACTIONS BAR (Kave Home Editorial Header) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 pb-3 text-[11px] text-neutral-500">
        <nav className="flex items-center gap-1.5 tracking-tight flex-wrap">
          <Link to="/" className="hover:text-black transition-colors">{language === 'en' ? 'Home' : 'Inicio'}</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-neutral-400">{product.brand_collection || 'Colección Atelier'}</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold truncate max-w-[220px] sm:max-w-xs">{product.name}</span>
        </nav>

        <div className="flex items-center gap-3 self-end sm:self-auto text-neutral-600">
          <button 
            onClick={handleShare}
            className="flex items-center gap-1 text-[11px] font-medium hover:text-black transition-colors cursor-pointer"
            title="Copiar enlace del producto"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
          <span className="text-neutral-300">|</span>
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="flex items-center gap-1 text-[11px] font-medium hover:text-black transition-colors cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
            <span>{isWishlisted ? 'En Favoritos' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN PRODUCT VIEW: 12-COLUMNS SPLIT (GALLERY ON LEFT, STICKY COMMERCE ON RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
        
        {/* ==================== LEFT COLUMN: EDITORIAL PHOTO GALLERY ==================== */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          
          {/* MOBILE TOUCH CAROUSEL (< md) */}
          <div className="md:hidden relative">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-2xl"
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.clientWidth > 0) {
                  const idx = Math.round(el.scrollLeft / el.clientWidth);
                  setCurrentSlideIndex(Math.min(Math.max(0, idx), imagesList.length - 1));
                }
              }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {imagesList.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setLightboxIndex(idx)}
                  className="shrink-0 w-full aspect-[4/5] bg-[#F7F6F3] overflow-hidden snap-center relative cursor-pointer"
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`} 
                    className="w-full h-full object-cover object-center" 
                  />
                  
                  {/* Kave Home Floating Badges on Mobile */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="bg-black/85 text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 backdrop-blur-xs">
                      DISEÑO EXCLUSIVO
                    </span>
                    {idx === 0 && (
                      <span className="bg-emerald-950/80 text-emerald-200 text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 backdrop-blur-xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> MATERIALES NOBLES
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] font-mono px-2.5 py-1 rounded-sm">
                    {idx + 1} / {imagesList.length}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Dots */}
            {imagesList.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 pt-3">
                {imagesList.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlideIndex === idx ? 'w-6 bg-black' : 'w-1.5 bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP FULL-BLEED EDITORIAL GALLERY (>= md) */}
          <div className="hidden md:block space-y-3">
            
            {/* Top Large Editorial Cards (Room Scene & Detail) */}
            <div className={`grid ${topTwoImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {topTwoImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-[4/5] bg-[#FAF9F6] rounded-2xl overflow-hidden cursor-zoom-in group relative shadow-2xs border border-neutral-100/60"
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  
                  {/* Kave Home Floating Editorial Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {idx === 0 && (
                      <span className="bg-neutral-950 text-white text-[9px] font-mono uppercase tracking-[0.2em] px-3 py-1 shadow-sm">
                        DISEÑO EXCLUSIVO
                      </span>
                    )}
                    {idx === 1 && (
                      <span className="bg-emerald-950/90 text-emerald-200 text-[8.5px] font-mono uppercase tracking-widest px-2.5 py-0.5 shadow-sm flex items-center gap-1 backdrop-blur-xs">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-300" /> MATERIALES NOBLES
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Zoom Pill */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-end justify-end p-4">
                    <span className="bg-neutral-900/90 text-white text-[10px] font-mono px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5 rounded-sm">
                      <Eye className="w-3.5 h-3.5" /> AMPLIAR DETALLE
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Macro Detail Grid (3 or 2 Columns) for Material Texture & Craftsmanship */}
            {remainingImages.length > 0 && (
              <div className={`grid ${remainingImages.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                {remainingImages.map((img, idx) => {
                  const actualIdx = idx + 2;
                  return (
                    <div 
                      key={actualIdx}
                      onClick={() => setLightboxIndex(actualIdx)}
                      className="aspect-[4/5] bg-[#FAF9F6] rounded-2xl overflow-hidden cursor-zoom-in group relative shadow-2xs border border-neutral-100/60"
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} Textura ${idx + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-end justify-end p-3">
                        <span className="bg-neutral-900/90 text-white text-[9px] font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider rounded-sm">
                          VISTA #{actualIdx + 1} 🔍
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Guaranteed Safe Packaging & Studio Callout */}
            <div className="bg-[#FAF9F6] border border-neutral-200/60 rounded-2xl p-4 flex items-center justify-between text-xs text-neutral-600">
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-neutral-800" />
                <span className="font-medium text-neutral-800">Embalaje de Seguridad & Protección Anti-impacto Reforzado</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline">
                Certificación Transporte Seguro
              </span>
            </div>

          </div>

        </div>

        {/* ==================== RIGHT COLUMN: STICKY COMMERCIAL & SPEC PANEL ==================== */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Header & Product Identity */}
          <div className="space-y-2 border-b border-neutral-100 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-neutral-400 block">
                  {product.brand_collection || 'DISEÑO TU ESPACIO COLLECTION'}
                </span>
                {product.sku && (
                  <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                    Ref. {product.sku}
                  </span>
                )}
              </div>

              {/* Heart Wishlist Pill */}
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100 cursor-pointer"
                title="Añadir a lista de deseos"
              >
                <Heart className={`w-5 h-5 stroke-[1.4] ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none'}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <p className="text-xs text-neutral-500 font-light flex items-center gap-2 flex-wrap">
              <span>{product.category}</span>
              {product.style && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span>Estilo {product.style}</span>
                </>
              )}
              {product.warranty && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Garantía: {product.warranty}
                  </span>
                </>
              )}
            </p>

            {/* Rating Stars & Direct Reviews Scroll */}
            <a
              href="#reviews-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 pt-1 group cursor-pointer w-fit"
            >
              <div className="flex text-emerald-600">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${
                      i <= Math.round(reviewStats.averageRating) && reviewStats.totalReviews > 0
                        ? 'fill-emerald-600 text-emerald-600' 
                        : 'text-neutral-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium group-hover:text-black group-hover:underline transition-colors">
                {reviewStats.totalReviews > 0 
                  ? `${reviewStats.averageRating.toFixed(1)} (${reviewStats.totalReviews} ${reviewStats.totalReviews === 1 ? 'opinión' : 'opiniones verificadas'})`
                  : 'Sin reseñas aún · Sé el primero en opinar'}
              </span>
            </a>
          </div>

          {/* Pricing Block & Installments (Addi / Card Financing) */}
          <div className="space-y-2 border-b border-neutral-100 pb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-neutral-950 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center gap-2">
                  <span className="line-through text-neutral-400 text-base">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Interest-free Financing Callout */}
            <div className="p-2.5 bg-neutral-50 border border-neutral-200/70 rounded-xl flex items-center justify-between text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>O <strong>3 cuotas sin interés</strong> de <strong>{formatPrice(installmentAmount)}</strong></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Addi / Tarjeta
              </span>
            </div>

            {/* B2B Wholesale Special Pricing if Authenticated */}
            {isAuthenticated && product.wholesale_price && product.wholesale_price > 0 && (
              <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-800 block">
                    Tarifa Profesional Arquitectos & B2B
                  </span>
                  <span className="text-sm font-black text-emerald-800">
                    {formatPrice(product.wholesale_price)} <span className="text-[10px] font-normal text-emerald-700">c/u</span>
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Mín. {product.wholesale_min_qty || 5} unidades
                </span>
              </div>
            )}

            <p className="text-[10.5px] text-neutral-400 pt-0.5">
              IVA incluido • Precios transparentes sin costos ocultos
            </p>
          </div>

          {/* Color & Material Finish Swatches (Kave Home Swatch Pills) */}
          {swatches.length > 0 && (
            <div className="space-y-2.5 border-b border-neutral-100 pb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                  Acabado Seleccionado:
                </span>
                <span className="font-extrabold text-neutral-900">
                  {selectedSwatch?.name || 'Estándar'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {swatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.name}
                    className={`w-8 h-8 rounded-full border border-neutral-300 transition-all cursor-pointer ${
                      selectedColorIndex === idx 
                        ? 'ring-2 ring-black ring-offset-2 scale-110 shadow-xs' 
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability & City Delivery Date Estimator (Kave Home Real-Time Logistics) */}
          <div className="space-y-3 bg-[#FAF9F6] border border-neutral-200/80 rounded-2xl p-4 text-xs">
            
            {/* Live Stock Pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span>En Stock · Listo para Despacho Inmediato</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {product.stock ? `${product.stock} disp.` : 'Showroom'}
              </span>
            </div>

            {/* Delivery Estimation by City */}
            <div className="pt-2 border-t border-neutral-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-700" /> Destino de Entrega:
                </span>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="Bogotá D.C.">Bogotá D.C.</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Bucaramanga">Bucaramanga</option>
                  <option value="Eje Cafetero">Eje Cafetero</option>
                  <option value="Resto del país">Resto del país</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-neutral-800 bg-white/80 p-2.5 rounded-xl border border-neutral-200/50">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 block text-[11.5px]">
                    Recíbelo entre el {getEstimatedDates(selectedCity)}
                  </span>
                  <span className="text-[10.5px] text-neutral-500 font-light">
                    Envío asegurado por transportadora certificada
                  </span>
                </div>
              </div>

              {/* Tiempo Real de Garantía del Producto */}
              {product.warranty && (
                <div className="flex items-center gap-2 text-neutral-800 bg-white/80 p-2.5 rounded-xl border border-neutral-200/50">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-900 block text-[11.5px]">
                      Garantía Real del Fabricante: <span className="text-emerald-950 font-extrabold">{product.warranty}</span>
                    </span>
                    <span className="text-[10.5px] text-neutral-500 font-light">
                      Cobertura directa y respaldo posventa oficial
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Quantity Selector & High-Contrast CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shrink-0">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-extrabold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Main Buy Button (Black High Contrast Pill) */}
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-black/10 cursor-pointer active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4 text-white" /> 
                <span>{language === 'en' ? 'Add to Shopping Bag' : 'Añadir a la cesta'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Consultation CTA for High-Ticket Orders */}
            <a 
              href={whatsappAdvisorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 border border-neutral-300 hover:border-black rounded-xl text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <span>Consultar con Asesor de Interiorismo (WhatsApp)</span>
            </a>
          </div>

          {/* 4 Value-Added Trust Badges (Kave Home Pillars) */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-600">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-bold">Envío Seguro</strong>
                <span className="text-neutral-500">Embalaje reforzado a todo el país</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-bold">Pago 100% Seguro</strong>
                <span className="text-neutral-500">Pasarelas encriptadas Bold & Addi</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-bold">Devolución 14 Días</strong>
                <span className="text-neutral-500">Retorno fácil y garantizado</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-bold">Materiales Nobles</strong>
                <span className="text-neutral-500">Acabados de calidad superior</span>
              </div>
            </div>
          </div>

          {/* KAVE HOME TECHNICAL & SPECIFICATION ACCORDIONS */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200 text-xs pt-2">
            
            {/* Tab 1: Dimensions & Measurements */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'dimensions' ? null : 'dimensions')}
                className="w-full py-3.5 flex justify-between items-center font-bold text-neutral-900 text-left hover:text-black cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-neutral-500" /> Medidas y Dimensiones
                </span>
                {openSection === 'dimensions' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openSection === 'dimensions' && (
                <div className="pb-4 text-neutral-600 font-light text-[11.5px] leading-relaxed space-y-2 animate-fadeIn">
                  <div className="p-3 bg-neutral-50 rounded-xl space-y-1 font-mono text-[11px]">
                    <p className="font-semibold text-neutral-800">
                      • Dimensiones Principales: <span className="font-normal">{product.dimensions || 'Ver especificaciones o consultar con showroom'}</span>
                    </p>
                    {product.materials && (
                      <p className="text-neutral-600">
                        • Composición: <span className="font-normal">{product.materials}</span>
                      </p>
                    )}
                  </div>
                  <p className="text-[10.5px] text-neutral-400">
                    Las medidas pueden presentar variaciones menores de +/- 1cm debido al proceso artesanal de fabricación.
                  </p>
                </div>
              )}
            </div>

            {/* Tab 2: Technical Specifications & Details */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                className="w-full py-3.5 flex justify-between items-center font-bold text-neutral-900 text-left hover:text-black cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" /> Ficha Técnica & Especificaciones
                </span>
                {openSection === 'details' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openSection === 'details' && (
                <div className="pb-4 text-neutral-600 font-light text-[11.5px] leading-relaxed space-y-2.5 animate-fadeIn">
                  <p className="text-neutral-800">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[11px]">
                    <div className="p-2 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Categoría</span>
                      <span className="font-semibold text-neutral-900">{product.category}</span>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Colección</span>
                      <span className="font-semibold text-neutral-900">{product.brand_collection || 'Atelier'}</span>
                    </div>
                    {product.warranty ? (
                      <div className="p-2.5 bg-neutral-50 rounded-lg col-span-2 border border-neutral-100 flex items-center justify-between">
                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-bold block">Garantía Oficial del Producto</span>
                          <span className="font-bold text-neutral-900 text-xs">{product.warranty}</span>
                        </div>
                        <span className="text-[10px] bg-neutral-200/60 text-neutral-700 px-2.5 py-0.5 rounded-full font-semibold">
                          Directa de Fábrica
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 bg-neutral-50 rounded-lg col-span-2">
                        <span className="text-neutral-400 text-[10px] uppercase font-bold block">Garantía Oficial</span>
                        <span className="font-semibold text-neutral-700">Según política de categoría y fabricante</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tab 3: Sustainability & Materials ("Kave Cares" approach) */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'sustainability' ? null : 'sustainability')}
                className="w-full py-3.5 flex justify-between items-center font-bold text-neutral-900 text-left hover:text-black cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Sostenibilidad & Materiales Nobles
                </span>
                {openSection === 'sustainability' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openSection === 'sustainability' && (
                <div className="pb-4 text-neutral-600 font-light text-[11.5px] leading-relaxed space-y-2 animate-fadeIn">
                  <p>
                    En <strong>Diseño Tu Espacio</strong> seleccionamos piezas elaboradas con materias primas nobles, procesos conscientes y acabados no tóxicos.
                  </p>
                  <ul className="space-y-1 list-disc list-inside text-neutral-700 font-medium">
                    <li>Acabados libres de químicos abrasivos o solventes pesados.</li>
                    <li>Embalaje con protección de cartón reciclable y reducción de plásticos de un solo uso.</li>
                    <li>Fabricación bajo estándares de durabilidad extendida para evitar la cultura del descarte.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tab 4: Shipping, Safe Transport & Return Policy */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full py-3.5 flex justify-between items-center font-bold text-neutral-900 text-left hover:text-black cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" /> Envío, Entrega & Devoluciones
                </span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openSection === 'shipping' && (
                <div className="pb-4 text-neutral-600 font-light text-[11.5px] leading-relaxed space-y-2 animate-fadeIn">
                  <p>
                    {product.shipping_returns_info || 'Todos nuestros envíos viajan asegurados contra siniestros o roturas de transporte con cobertura total hasta la entrega en tu domicilio.'}
                  </p>
                  <p className="text-[10.5px] text-neutral-500">
                    Cuentas con 14 días calendario a partir de la recepción para solicitar devoluciones o cambios en caso de inconformidad con el producto.
                  </p>
                </div>
              )}
            </div>

            {/* Tab 5: Care Instructions & Maintenance */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
                className="w-full py-3.5 flex justify-between items-center font-bold text-neutral-900 text-left hover:text-black cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-500" /> Instrucciones de Limpieza & Cuidados
                </span>
                {openSection === 'care' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openSection === 'care' && (
                <div className="pb-4 text-neutral-600 font-light text-[11.5px] leading-relaxed space-y-2 animate-fadeIn">
                  <p>
                    {product.care_instructions || 'Limpiar suavemente la superficie utilizando un paño de microfibra seco o ligeramente húmedo. Evitar el contacto directo con disolventes, ácidos o productos abrasivos que puedan alterar el brillo o textura del material.'}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3. REAL CUSTOMER REVIEWS & RATINGS SECTION */}
      <div id="reviews-section" className="pt-8">
        <ProductReviewsSection
          productId={product.id || product.slug}
          productName={product.name}
          onStatsCalculated={(stats) => setReviewStats(stats)}
        />
      </div>

      {/* 4. "COMPLETA EL LOOK" (KAVE HOME "SHOP THE LOOK" INSPIRATIONAL SECTION) */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-neutral-200 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                Interiorismo Sugerido • Shop The Look
              </span>
              <h2 className="text-2xl font-light text-neutral-900 uppercase tracking-wider">
                Completa el Look
              </h2>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Piezas seleccionadas por nuestro estudio para combinar en armonía con {product.name}
              </p>
            </div>
            <Link to="/catalog" className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:underline">
              Explorar Catálogo Completo →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* 5. LIGHTBOX HIGH-RES FULLSCREEN VIEWER MODAL */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md font-sans animate-fadeIn">
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-amber-300 p-2 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 z-50 bg-black/50 border border-white/20 px-3 py-1.5 rounded-full cursor-pointer"
          >
            <span>Cerrar</span> <X className="w-5 h-5" />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center w-full">
            {imagesList.length > 1 && (
              <button 
                onClick={() => setLightboxIndex((lightboxIndex - 1 + imagesList.length) % imagesList.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 text-white p-3 hover:bg-black transition-colors z-40 border border-white/20 hover:border-white rounded-full cursor-pointer"
                title="Fotografía Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img 
              src={imagesList[lightboxIndex]} 
              alt={`Vista ampliada ${lightboxIndex + 1}`}
              className="max-h-[85vh] w-auto object-contain border border-white/10 shadow-2xl rounded-lg"
            />

            {imagesList.length > 1 && (
              <button 
                onClick={() => setLightboxIndex((lightboxIndex + 1) % imagesList.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 text-white p-3 hover:bg-black transition-colors z-40 border border-white/20 hover:border-white rounded-full cursor-pointer"
                title="Siguiente Fotografía"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] font-mono px-4 py-1.5 border border-white/20 rounded-full">
              {lightboxIndex + 1} / {imagesList.length} • {product.name}
            </div>
          </div>
        </div>
      )}

      {/* 6. MOBILE STICKY BOTTOM CONVERSION BAR (Appears on scroll for higher mobile conversion) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 z-40 md:hidden flex items-center justify-between shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <img 
              src={imagesList[0]} 
              alt={product.name} 
              className="w-11 h-11 object-cover rounded-lg border border-neutral-200 shrink-0" 
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-900 truncate">{product.name}</p>
              <p className="text-xs font-extrabold text-neutral-900">{formatPrice(product.price)}</p>
            </div>
          </div>

          <button 
            onClick={() => addToCart(product, quantity)}
            className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>
      )}

    </div>
  );
};
