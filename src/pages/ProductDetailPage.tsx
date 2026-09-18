import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronDown, ChevronUp, Truck, RefreshCw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/ProductCard';

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

  // Accordion Expandable States
  const [openSection, setOpenSection] = useState<'dimensions' | 'details' | 'shipping' | 'care' | null>('details');

  const { addToCart } = useCart();
  const { formatPrice, language } = useCurrency();

  useEffect(() => {
    if (slug) {
      // 1. Instant synchronous lookup from memory/local storage (0ms delay)
      const syncProd = productService.getProductBySlugSync(slug);
      if (syncProd) {
        setProduct(syncProd);
        const syncRelated = productService.getProductsSync().filter(p => p.id !== syncProd.id).slice(0, 3);
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
            setRelatedProducts(all.filter(p => p.id !== res.id).slice(0, 3));
          });
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="h-96 bg-brand-surface animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light">Pieza No Encontrada</h2>
        <p className="text-xs text-neutral-500">El producto solicitado no está disponible en este momento.</p>
        <Link to="/catalog" className="inline-block bg-brand-black text-white text-xs uppercase font-bold tracking-widest py-3 px-6">
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

  const swatches = (product.colors && product.colors.length > 0)
    ? product.colors 
    : [
        { name: 'Latón Dorado', hex: '#CDB375' },
        { name: 'Plata Níquel', hex: '#D4D4D2' },
        { name: 'Negro Mate', hex: '#1C1C1C' }
      ];

  const selectedSwatch = swatches[selectedColorIndex] || swatches[0] || { name: 'Estándar', hex: '#111111' };

  return (
    <div className="max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-6 py-4 space-y-6 font-sans">
      
      {/* Top Breadcrumb Navigation */}
      <nav className="text-[11px] text-neutral-500 font-light flex items-center gap-2 tracking-tight px-4 sm:px-0">
        <Link to="/" className="hover:text-black">{language === 'en' ? 'Home' : 'Página de inicio'}</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-black">{product.brand_collection || 'Diseño Tu Espacio Collection'}</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Product Layout: Full-Bleed Editorial Photo Grid (Left) & Checkout Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 items-start">
        
        {/* LEFT COLUMN: Westwing Full-Bleed Photo Grid (No Borders/Padding on Images) */}
        <div className="lg:col-span-8 space-y-1">
          
          {/* MOBILE VIEW (< md): Full-Width Touch Swipe Carousel */}
          <div className="md:hidden relative">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
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
                  className="shrink-0 w-full aspect-[1900/2375] bg-[#FAF9F6] overflow-hidden snap-center relative cursor-pointer"
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover object-center" />
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5">
                    {idx + 1} / {imagesList.length}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Carousel Pagination Dots */}
            {imagesList.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 pt-3 pb-1">
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

          {/* DESKTOP VIEW (>= md): Full-Bleed Edge-to-Edge Photo Grid */}
          <div className="hidden md:block space-y-1">
            
            {/* Top Row: 2 Large Side-by-Side Cards (Studio + Room Scene) */}
            <div className={`grid ${topTwoImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
              {topTwoImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-[1900/2375] bg-[#FAF9F6] overflow-hidden cursor-pointer group relative"
                >
                  <img 
                    src={img} 
                    alt={`${product.name} Vista ${idx + 1}`}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-3">
                    <span className="bg-black/85 text-white text-[9px] font-mono px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                      AMPLIAR FOTO 🔍
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row(s): 3-Column / 2-Column Grid for Detail Photos */}
            {remainingImages.length > 0 && (
              <div className={`grid ${remainingImages.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-1`}>
                {remainingImages.map((img, idx) => {
                  const actualIdx = idx + 2;
                  return (
                    <div 
                      key={actualIdx}
                      onClick={() => setLightboxIndex(actualIdx)}
                      className="aspect-[1900/2375] bg-[#FAF9F6] overflow-hidden cursor-pointer group relative"
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} Detalle ${idx + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-2">
                        <span className="bg-black/85 text-white text-[9px] font-mono px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                          DETALLE #{idx + 1} 🔍
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Purchase Panel with Elegant Spacing */}
        <div className="lg:col-span-4 px-6 py-6 lg:px-8 lg:py-2 space-y-6 lg:sticky lg:top-28">
          
          {/* Header & Collection Tag */}
          <div className="space-y-1 relative">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                {product.brand_collection || 'DISEÑO TU ESPACIO COLLECTION'}
              </span>

              {/* Wishlist Heart Icon */}
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-1 text-neutral-700 hover:text-black transition-colors"
                title="Añadir a favoritos"
              >
                <Heart className={`w-5 h-5 stroke-[1.2] ${isWishlisted ? 'fill-black text-black' : 'fill-none'}`} />
              </button>
            </div>

            <h1 className="text-3xl font-light text-neutral-900 tracking-tight leading-none">
              {product.name}
            </h1>
            
            <p className="text-xs text-neutral-500 font-light">
              {product.category}
            </p>

            {/* Social Proof / Star Rating */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex text-emerald-600">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">
                (1,372 reseñas)
              </span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="pt-2 border-t border-neutral-200">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="line-through text-neutral-400 text-sm">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {product.wholesale_price && product.wholesale_price > 0 && (
              <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block">
                    Precio Especial al Por Mayor
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {formatPrice(product.wholesale_price)} <span className="text-[10px] font-normal text-emerald-800">c/u</span>
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-800 text-white font-bold px-2 py-1 uppercase tracking-wider">
                  Mín. {product.wholesale_min_qty || 5} u/cajas
                </span>
              </div>
            )}

            <p className="text-[10px] text-neutral-400 mt-1">
              IVA incluido • Envío disponible en todo el país
            </p>
          </div>

          {/* Color & Material Variant Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">Acabado / Color</span>
              <span className="font-medium text-neutral-900">{selectedSwatch?.name || 'Estándar'}</span>
            </div>

            <div className="flex items-center gap-2">
              {swatches.map((swatch, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                  className={`w-7 h-7 border border-neutral-300 transition-all ${
                    selectedColorIndex === idx 
                      ? 'ring-2 ring-black ring-offset-2 border-transparent' 
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* High-Contrast Conversion CTA Button */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-neutral-300">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-sm text-neutral-600 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center text-sm text-neutral-600 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>

              {/* Full Width Black Buy Button */}
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-brand-black text-white text-xs font-bold uppercase tracking-widest h-12 px-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-elevated"
              >
                <ShoppingBag className="w-4 h-4" /> 
                {language === 'en' ? 'Add to Shopping Bag' : 'Añadir a la cesta'}
              </button>
            </div>
          </div>

          {/* Guarantees & Delivery Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 text-[11px] text-neutral-600">
            <div className="border-r border-neutral-200 pr-2 space-y-1">
              <span className="font-bold uppercase tracking-wider text-emerald-700 block flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" /> ENVÍO RÁPIDO
              </span>
              <p className="text-neutral-500 leading-tight">En 3-5 días hábiles a tu domicilio</p>
            </div>
            <div className="pl-2 space-y-1">
              <span className="font-bold uppercase tracking-wider text-emerald-700 block flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-700" /> DEVOLUCIÓN GRATIS
              </span>
              <p className="text-neutral-500 leading-tight">30 días de plazo de devolución sin costo</p>
            </div>
          </div>

          {/* Accordion Specification Dropdowns */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200 text-xs">
            
            {/* Tab: Dimensions */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'dimensions' ? null : 'dimensions')}
                className="w-full py-3.5 flex justify-between items-center font-medium text-neutral-900 text-left hover:text-black"
              >
                <span>Dimensiones</span>
                {openSection === 'dimensions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'dimensions' && (
                <div className="pb-4 text-neutral-600 font-light text-[11px] leading-relaxed">
                  <p>• {product.dimensions || '160cm alto x 38cm diámetro'}</p>
                  <p>• Longitud del cable: 220cm con interruptor de pie integrado.</p>
                </div>
              )}
            </div>

            {/* Tab: Details */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                className="w-full py-3.5 flex justify-between items-center font-medium text-neutral-900 text-left hover:text-black"
              >
                <span>Detalles del producto</span>
                {openSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'details' && (
                <div className="pb-4 text-neutral-600 font-light text-[11px] leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  <p>• Materiales principales: {product.materials || 'Aluminio espejado, acero'}.</p>
                  <p>• Casquillo: E27 (Bombilla LED cálida 2700K incluida).</p>
                </div>
              )}
            </div>

            {/* Tab: Shipping & Returns */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full py-3.5 flex justify-between items-center font-medium text-neutral-900 text-left hover:text-black"
              >
                <span>Envío & Devolución</span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'shipping' && (
                <div className="pb-4 text-neutral-600 font-light text-[11px] leading-relaxed">
                  Despachos protegidos en caja acolchada especial. Devoluciones sin costo adicional durante los primeros 30 días posteriores a la recepción.
                </div>
              )}
            </div>

            {/* Tab: Care Instructions */}
            <div>
              <button 
                onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
                className="w-full py-3.5 flex justify-between items-center font-medium text-neutral-900 text-left hover:text-black"
              >
                <span>Instrucciones de tratamiento</span>
                {openSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'care' && (
                <div className="pb-4 text-neutral-600 font-light text-[11px] leading-relaxed">
                  Limpiar suavemente con un paño de microfibra seco. No utilizar limpiadores abrasivos o disolventes químicos.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* CROSS-SELLING SECTION ("COMBINAN BIEN" / "COMPLETE THE LOOK") */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-neutral-200 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                Sugerencias de Interiorismo
              </span>
              <h2 className="text-xl font-light text-neutral-900 uppercase tracking-wider">
                Combinan Bien
              </h2>
            </div>
            <Link to="/catalog" className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:underline">
              Explorar Todo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox High-Res Fullscreen Modal Viewer */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md font-sans">
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-amber-300 p-2 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 z-50 bg-black/50 border border-white/20 px-3 py-1.5"
          >
            <span>Cerrar</span> <X className="w-5 h-5" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center w-full">
            {imagesList.length > 1 && (
              <button 
                onClick={() => setLightboxIndex((lightboxIndex - 1 + imagesList.length) % imagesList.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 text-white p-3 hover:bg-black transition-colors z-40 border border-white/20 hover:border-white"
                title="Fotografía Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img 
              src={imagesList[lightboxIndex]} 
              alt={`Vista ampliada ${lightboxIndex + 1}`}
              className="max-h-[85vh] w-auto object-contain border border-white/10 shadow-2xl"
            />

            {imagesList.length > 1 && (
              <button 
                onClick={() => setLightboxIndex((lightboxIndex + 1) % imagesList.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 text-white p-3 hover:bg-black transition-colors z-40 border border-white/20 hover:border-white"
                title="Siguiente Fotografía"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] font-mono px-3 py-1 border border-white/20">
              {lightboxIndex + 1} / {imagesList.length} • {product.name}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
