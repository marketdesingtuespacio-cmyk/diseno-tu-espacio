import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, QrCode, Camera } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { isWallpaperProduct, isWallpaperBlackFridayActive } from '../services/productService';

const ProductQRModal = lazy(() =>
  import('./admin/ProductQRModal').then((m) => ({ default: m.ProductQRModal }))
);

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const colorSwatches = (product.colors && product.colors.length > 0) ? product.colors : [];

  const isAgotado = product.stock <= 0 || product.inventory_status === 'Agotado';
  const hasBlackFridayOffer = !isAgotado && isWallpaperProduct(product) && isWallpaperBlackFridayActive();

  return (
    <div className="group relative flex flex-col font-sans transition-all duration-300">
      
      {/* Product Image Frame Locked Strictly to 1900 × 2375 Ratio (Pristine Clean Minimalist) */}
      <div className="relative aspect-[1900/2375] w-full bg-[#FAF9F6] border border-neutral-200/80 overflow-hidden flex items-center justify-center">
        
        {/* Agotado / Out of Stock Badge */}
        {isAgotado && (
          <span className="absolute top-3 left-3 z-10 bg-neutral-900/90 text-white text-[9.5px] uppercase font-bold tracking-wider px-2.5 py-1 shadow-xs">
            Agotado
          </span>
        )}

        {/* Black Friday Wallpaper Offer Badge (active until Nov 30) */}
        {hasBlackFridayOffer && (
          <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9.5px] uppercase font-extrabold tracking-wider px-2.5 py-1 shadow-sm">
            Black Friday • $480.000
          </span>
        )}

        {/* Wishlist Heart Button (Top Right) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Añadir a lista de deseos"
          className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-xs rounded-full text-neutral-800 hover:text-black transition-all shadow-xs"
        >
          <Heart 
            className={`w-4 h-4 stroke-[1.5] transition-colors ${
              isWishlisted ? 'fill-black text-black' : 'fill-none text-neutral-800'
            }`} 
          />
        </button>

        {/* High Resolution Product Photograph */}
        <Link to={`/product/${product.slug}`} className="w-full h-full block relative bg-neutral-100">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              onLoad={(e) => (e.currentTarget.style.opacity = '1')}
              className={`w-full h-full object-cover object-center group-hover:scale-105 opacity-0 transition-all duration-500 ease-out ${
                isAgotado ? 'grayscale-[20%]' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F7F6F3] text-neutral-400 group-hover:bg-neutral-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-neutral-200/60 flex items-center justify-center text-neutral-400 mb-2">
                <Camera className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Fotografía</span>
              <span className="text-[9px] text-neutral-400 mt-0.5">En preparación</span>
            </div>
          )}
        </Link>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          {isAgotado ? (
            <button 
              disabled
              className="flex-1 bg-neutral-300 text-neutral-600 text-[10px] font-bold uppercase tracking-widest py-2.5 px-3 cursor-not-allowed flex items-center justify-center gap-1.5 shadow-subtle"
            >
              Sin Existencias
            </button>
          ) : (
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest py-2.5 px-3 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-elevated"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Añadir
            </button>
          )}
          <Link 
            to={`/product/${product.slug}`}
            className="bg-white text-black p-2.5 hover:bg-neutral-100 transition-colors flex items-center justify-center border border-neutral-200 shadow-elevated"
            title="Vista Detallada"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQRModalOpen(true);
            }}
            className="bg-white text-black p-2.5 hover:bg-neutral-100 transition-colors flex items-center justify-center border border-neutral-200 shadow-elevated cursor-pointer"
            title="Ver Código QR para Ruteo Físico"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
          </button>
        </div>

      </div>

      {/* Color Variant Swatches Bar */}
      {colorSwatches.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3 mb-1 h-4">
          {colorSwatches.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setActiveColorIndex(idx)}
              title={color.name}
              style={{ backgroundColor: color.hex }}
              className={`w-3.5 h-3.5 rounded-none border border-neutral-300 transition-all ${
                activeColorIndex === idx ? 'ring-1 ring-black ring-offset-1 border-transparent' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}

      {/* Product Title & Collection Meta (Clean & Elegant) */}
      <div className="space-y-0.5 text-left">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug group-hover:underline line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px] text-neutral-400 font-light tracking-tight">
          {product.brand_collection || 'Diseño Tu Espacio Collection'}
        </p>
      </div>

      {/* Price & Offer Display with Dynamic Currency Formatting */}
      <div className="mt-1 text-[13px] space-y-0.5">
        {product.original_price && product.original_price > product.price ? (
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="line-through text-neutral-400 text-xs font-normal">
                {formatPrice(product.original_price)}
              </span>
              <span className="font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
            </div>
            {hasBlackFridayOffer && (
              <span className="block text-[10px] font-bold uppercase tracking-wider text-red-600">
                Oferta Black Friday hasta el 30 de nov
              </span>
            )}
          </div>
        ) : (
          <span className="font-bold text-neutral-900 block">
            {formatPrice(product.price)}
          </span>
        )}

        {isAuthenticated && product.wholesale_price && product.wholesale_price > 0 && (
          <div className="text-[10.5px] font-semibold text-emerald-700 tracking-tight">
            Por mayor: {formatPrice(product.wholesale_price)} ({product.wholesale_min_qty || 5}+ u/cajas)
          </div>
        )}
      </div>

      {/* Product Physical Routing QR Modal (loaded only on demand) */}
      {isQRModalOpen && (
        <Suspense fallback={null}>
          <ProductQRModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            product={product}
          />
        </Suspense>
      )}

    </div>
  );
};
