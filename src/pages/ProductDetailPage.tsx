import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronDown, ChevronUp, Truck, RefreshCw } from 'lucide-react';
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Accordion Expandable States
  const [openSection, setOpenSection] = useState<'dimensions' | 'details' | 'shipping' | 'care' | null>('details');

  const { addToCart } = useCart();
  const { formatPrice, language } = useCurrency();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      productService.getProductBySlug(slug).then(res => {
        setProduct(res);
        if (res) {
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

  const swatches = product.colors || [
    { name: 'Cromo Espejo', hex: '#E0E0E0' },
    { name: 'Negro Azabache', hex: '#111111' },
    { name: 'Beige Nude', hex: '#D6C8BC' },
    { name: 'Verde Oliva', hex: '#485244' }
  ];

  const selectedSwatch = swatches[selectedColorIndex] || swatches[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12 font-sans">
      
      {/* Top Breadcrumb Navigation */}
      <nav className="text-[11px] text-neutral-500 font-light flex items-center gap-2 tracking-tight">
        <Link to="/" className="hover:text-black">{language === 'en' ? 'Home' : 'Página de inicio'}</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-black">{product.brand_collection || 'Diseño Tu Espacio Collection'}</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Product Layout: Dual Photo Grid (Left) & Sales Conversion Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Dual High-Res 1900×2375 Photo Presentation (Studio + In-Situ Room Scene) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Photo 1: Studio Isolated Photography */}
          <div className="aspect-[1900/2375] bg-[#FAF9F6] border border-neutral-200/60 overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={`${product.name} Estudio`}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Photo 2: In-Situ Lifestyle Interior Scene */}
          <div className="aspect-[1900/2375] bg-[#FAF9F6] border border-neutral-200/60 overflow-hidden">
            <img 
              src={product.images[1] || product.images[0]} 
              alt={`${product.name} Ambiente Interiorismo`}
              className="w-full h-full object-cover object-center"
            />
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky High-Conversion Checkout Panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
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
              {product.original_price && (
                <span className="line-through text-neutral-400 text-sm">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              IVA incluido • Envío disponible en todo el país
            </p>
          </div>

          {/* Color & Material Variant Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">Acabado / Color</span>
              <span className="font-medium text-neutral-900">{selectedSwatch.name}</span>
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

    </div>
  );
};
