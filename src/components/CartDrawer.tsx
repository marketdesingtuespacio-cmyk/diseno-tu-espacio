import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-white shadow-elevated flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-black" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black">
                Bolsa de Compras ({cart.length})
              </h3>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="p-1 text-neutral-500 hover:text-brand-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-brand-border">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 py-12">
                <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-neutral-300" />
                <p className="text-xs uppercase tracking-wider font-medium text-neutral-600 mb-1">Tu bolsa está vacía</p>
                <p className="text-xs text-neutral-400">Descubre nuestra colección exclusiva de iluminación</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-brand-surface rounded-none border border-brand-border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-medium text-brand-black line-clamp-1">{item.product.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{item.product.category}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-brand-border">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-neutral-600 hover:bg-brand-surface"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-neutral-600 hover:bg-brand-surface"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-bold text-brand-black">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-border bg-brand-surface">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs uppercase tracking-wider text-neutral-500">Subtotal Estimado</span>
                <span className="text-base font-bold text-brand-black">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mb-4">Impuestos y gastos de envío calculados en la pantalla de pago.</p>
              
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                Proceder al Pago <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
