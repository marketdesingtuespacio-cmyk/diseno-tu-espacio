import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const colorSwatches = product.colors || [
    { name: 'Níquel', hex: '#D4D4D2' },
    { name: 'Negro', hex: '#1C1C1C' }
  ];

  return (
    <div className="group relative flex flex-col font-sans transition-all duration-300">
      
      {/* Product Image Frame Locked Strictly to 1900 × 2375 Ratio (Pristine Clean Minimalist) */}
      <div className="relative aspect-[1900/2375] w-full bg-[#FAF9F6] border border-neutral-200/80 overflow-hidden flex items-center justify-center">
        
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
        <Link to={`/product/${product.slug}`} className="w-full h-full block">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          <button 
            onClick={() => addToCart(product)}
            className="flex-1 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest py-2.5 px-3 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-elevated"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Añadir
          </button>
          <Link 
            to={`/product/${product.slug}`}
            className="bg-white text-black p-2.5 hover:bg-neutral-100 transition-colors flex items-center justify-center border border-neutral-200 shadow-elevated"
            title="Vista Detallada"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Color Variant Swatches Bar */}
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
      <div className="mt-1 text-[13px]">
        {product.original_price ? (
          <div className="flex items-center gap-2">
            <span className="line-through text-neutral-400 text-xs font-normal">
              {formatPrice(product.original_price)}
            </span>
            <span className="font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
          </div>
        ) : (
          <span className="font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

    </div>
  );
};
