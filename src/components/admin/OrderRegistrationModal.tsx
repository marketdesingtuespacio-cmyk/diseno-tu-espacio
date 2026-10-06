import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Trash2, 
  ShoppingBag, 
  UserCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  PackageCheck,
  Tag
} from 'lucide-react';
import { Product, OrderItem, Order } from '../../types';
import { orderService } from '../../services/orderService';
import { useCurrency } from '../../context/CurrencyContext';

interface OrderRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: Product[];
}

export const OrderRegistrationModal: React.FC<OrderRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  products
}) => {
  const { formatPrice } = useCurrency();

  // Customer Profile State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTag, setCustomerTag] = useState<Order['customer_tag']>('Residencial');
  const [notes, setNotes] = useState('');

  // Shipping & Tracking State
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');
  const [carrier, setCarrier] = useState('Servientrega');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Order Items & Financials State
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(35000);
  const [discount, setDiscount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  // Wholesale vs Retail Pricing Mode State ('detal' | 'mayorista' | 'mixto')
  const [pricingMode, setPricingMode] = useState<'detal' | 'mayorista' | 'mixto'>('detal');

  // Payment & Status State
  const [paymentGateway, setPaymentGateway] = useState('Transferencia Directa Bancaria');
  const [paymentMethod, setPaymentMethod] = useState('Consignación / Efectivo Showroom');
  const [orderStatus, setOrderStatus] = useState<Order['status']>('processing');

  // Product Search State inside Modal
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEffectiveWholesalePrice = (product: Product): number => {
    if (product.wholesale_price && Number(product.wholesale_price) > 0) {
      return Number(product.wholesale_price);
    }
    return Math.round(product.price * 0.8);
  };

  // Add Product to Cart/Items list with support for Wholesale and Retail prices
  const handleAddProduct = (product: Product, forceWholesale?: boolean) => {
    const isWholesale = forceWholesale !== undefined ? forceWholesale : (pricingMode === 'mayorista');
    const unitPrice = isWholesale ? getEffectiveWholesalePrice(product) : product.price;
    const targetPriceType = isWholesale ? 'wholesale' : 'retail';

    const existingIndex = items.findIndex(i => i.product_id === product.id && i.price_type === targetPriceType);
    if (existingIndex !== -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      setItems(updated);
    } else {
      const selectedColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;
      setItems([
        ...items,
        {
          product_id: product.id,
          name: product.name,
          image: product.images[0] || '',
          price: unitPrice,
          quantity: 1,
          color: selectedColor,
          price_type: targetPriceType,
          original_retail_price: product.price
        }
      ]);
    }
  };

  const handleToggleItemPriceType = (index: number) => {
    const updated = [...items];
    const targetItem = updated[index];
    const productObj = products.find(p => p.id === targetItem.product_id);
    const newPriceType = targetItem.price_type === 'wholesale' ? 'retail' : 'wholesale';
    
    if (newPriceType === 'wholesale') {
      targetItem.price_type = 'wholesale';
      targetItem.price = productObj ? getEffectiveWholesalePrice(productObj) : Math.round((targetItem.original_retail_price || targetItem.price) * 0.8);
    } else {
      targetItem.price_type = 'retail';
      targetItem.price = targetItem.original_retail_price || productObj?.price || targetItem.price;
    }
    setItems(updated);
  };

  const handleUpdateItemUnitPrice = (index: number, newPrice: number) => {
    const updated = [...items];
    updated[index].price = Math.max(0, newPrice);
    setItems(updated);
  };

  const handleSetGlobalPricingMode = (mode: 'detal' | 'mayorista') => {
    setPricingMode(mode);
    if (items.length > 0) {
      const updated = items.map(item => {
        const productObj = products.find(p => p.id === item.product_id);
        if (mode === 'mayorista') {
          return {
            ...item,
            price_type: 'wholesale' as const,
            price: productObj ? getEffectiveWholesalePrice(productObj) : Math.round((item.original_retail_price || item.price) * 0.8)
          };
        } else {
          return {
            ...item,
            price_type: 'retail' as const,
            price: item.original_retail_price || productObj?.price || item.price
          };
        }
      });
      setItems(updated);
    }
  };

  const handleSelectCustomerTag = (tag: Order['customer_tag']) => {
    setCustomerTag(tag);
    if (tag === 'Mayorista') {
      handleSetGlobalPricingMode('mayorista');
    }
  };

  // Adjust item quantity
  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...items];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setItems(updated);
  };

  // Remove item line
  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Update item color
  const handleColorChange = (index: number, color: string) => {
    const updated = [...items];
    updated[index].color = color;
    setItems(updated);
  };

  // Subtotal and Total calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal + shippingCost - discount);

  // Submit Order Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return alert('Por favor ingrese el nombre completo del cliente.');
    if (!customerPhone.trim()) return alert('Por favor ingrese el teléfono del cliente.');
    if (items.length === 0) return alert('Debe agregar al menos 1 producto al pedido.');

    const orderRef = `DT-${Math.floor(100000 + Math.random() * 900000)}`;

    const wholesaleCount = items.filter(i => i.price_type === 'wholesale').length;
    const computedPricingMode: Order['pricing_mode'] = 
      wholesaleCount === items.length ? 'mayorista' :
      wholesaleCount === 0 ? 'detal' : 'mixto';

    const calculatedDeposit = Math.max(0, depositAmount);
    const calculatedPending = Math.max(0, grandTotal - calculatedDeposit);
    const calculatedPaymentStatus: Order['payment_status'] = 
      calculatedDeposit >= grandTotal && grandTotal > 0 ? 'paid' :
      calculatedDeposit > 0 ? 'partial' : 'pending';

    await orderService.createOrder({
      order_ref: orderRef,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || 'cliente@diseñotuespacio.com',
      customer_phone: customerPhone.trim(),
      customer_tag: customerTag,
      pricing_mode: computedPricingMode,
      shipping_address: shippingAddress.trim(),
      city: city.trim(),
      carrier,
      tracking_number: trackingNumber.trim(),
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total: grandTotal,
      deposit_amount: calculatedDeposit,
      pending_balance: calculatedPending,
      payment_status: calculatedPaymentStatus,
      status: orderStatus,
      payment_method: paymentMethod,
      payment_gateway: paymentGateway,
      items_count: items.reduce((acc, i) => acc + i.quantity, 0),
      items,
      notes: notes.trim(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-2xl max-w-5xl w-full border border-white/80 rounded-2xl sm:rounded-3xl shadow-2xl my-auto text-xs font-sans overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center bg-neutral-950 text-white px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-amber-400/10 border border-amber-400/30 rounded-xl shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                Registro de Pedido & CRM Posventa
              </h2>
              <p className="text-[10px] text-neutral-400 font-light truncate hidden sm:block">
                Diseño Tu Espacio — Sistema de Alta de Órdenes Directas y Gestión de Clientes
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/10 transition-colors text-neutral-300 rounded-xl shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          
          {/* STEP 1: VISUAL PRODUCT SELECTOR */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-2.5 sm:pb-3 gap-2">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-brand-black" />
                <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs">
                  1. Selección Visual de Productos
                </h3>
              </div>

              {/* Pricing Mode Toggle: Detal vs Mayorista */}
              <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start sm:self-auto">
                <span className="text-[9.5px] uppercase font-extrabold text-neutral-500 px-1">Tarifa:</span>
                <button
                  type="button"
                  onClick={() => handleSetGlobalPricingMode('detal')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    pricingMode === 'detal'
                      ? 'bg-white text-brand-black shadow-xs font-extrabold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  🛒 Detal
                </button>
                <button
                  type="button"
                  onClick={() => handleSetGlobalPricingMode('mayorista')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    pricingMode === 'mayorista'
                      ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                      : 'text-emerald-700 hover:bg-emerald-100/60'
                  }`}
                >
                  🏢 Mayorista
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input 
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-brand-black font-medium transition-all"
              />
            </div>

            {/* Visual Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 max-h-56 overflow-y-auto pr-1">
              {filteredProducts.map(product => {
                const wholesaleVal = getEffectiveWholesalePrice(product);
                return (
                  <div 
                    key={product.id}
                    className="bg-white border border-neutral-200/80 rounded-xl p-2 sm:p-2.5 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group relative"
                  >
                    <div 
                      onClick={() => handleAddProduct(product)}
                      className="aspect-[4/5] bg-neutral-100 rounded-lg mb-2 overflow-hidden relative border border-neutral-100 cursor-pointer"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-md text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                        {product.stock} u.
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[10px] sm:text-[11px] text-brand-black truncate">{product.name}</h4>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 truncate">{product.category}</p>
                      
                      <div className="mt-1.5 pt-1.5 border-t border-neutral-100 space-y-1">
                        <div className="flex justify-between items-center text-[9px] sm:text-[10px]">
                          <span className="text-neutral-500">Detal:</span>
                          <span className="font-mono font-bold text-brand-black">{formatPrice(product.price)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] sm:text-[10px]">
                          <span className="text-emerald-700 font-bold">Mayor:</span>
                          <span className="font-mono font-extrabold text-emerald-700">{formatPrice(wholesaleVal)}</span>
                        </div>
                        
                        <div className="flex gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAddProduct(product, false)}
                            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[9px] font-bold py-1 rounded-md transition-colors"
                          >
                            + Detal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddProduct(product, true)}
                            className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[9px] font-extrabold py-1 rounded-md transition-colors"
                          >
                            + Mayor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SELECTED LINE ITEMS & FINANCIAL RECAP */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5 sm:pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-black" /> 2. Productos en la Orden ({items.length})
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 font-mono">
                Subtotal: {formatPrice(subtotal)}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-6 sm:py-8 border border-dashed border-neutral-300 rounded-xl text-neutral-400 text-xs bg-neutral-50/50">
                No has seleccionado ningún producto. Haz clic en un producto para añadirlo.
              </div>
            ) : (
              <div className="divide-y border border-neutral-200/80 rounded-xl max-h-56 overflow-y-auto bg-white">
                {items.map((item, idx) => {
                  const productObj = products.find(p => p.id === item.product_id);
                  const isWholesale = item.price_type === 'wholesale';

                  return (
                    <div key={idx} className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-neutral-50/80 transition-colors">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <img src={item.image} alt={item.name} className="w-10 h-11 object-cover rounded-lg border bg-white shadow-xs shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-brand-black text-xs truncate">{item.name}</p>
                          
                          {/* Tariff Selector buttons directly under product title */}
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (isWholesale) handleToggleItemPriceType(idx);
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all flex items-center gap-1 ${
                                !isWholesale 
                                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs font-extrabold' 
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              🛒 Detal ({formatPrice(item.original_retail_price || productObj?.price || item.price)})
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!isWholesale) handleToggleItemPriceType(idx);
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all flex items-center gap-1 ${
                                isWholesale 
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-extrabold ring-2 ring-emerald-300 ring-offset-1' 
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-bold'
                              }`}
                            >
                              🏢 Mayorista ({formatPrice(productObj ? getEffectiveWholesalePrice(productObj) : Math.round((item.original_retail_price || item.price) * 0.8))})
                            </button>

                            <div className="flex items-center gap-1 pl-1">
                              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium">Unitario:</span>
                              <input
                                type="number"
                                min="0"
                                value={item.price}
                                onChange={(e) => handleUpdateItemUnitPrice(idx, Number(e.target.value))}
                                className="w-20 sm:w-24 bg-neutral-50 border border-neutral-300 rounded-md text-[9px] sm:text-[10px] px-1 py-0.5 font-mono font-extrabold text-brand-black"
                                title="Modificar precio unitario"
                              />
                            </div>
                          </div>

                          {isWholesale && item.original_retail_price && item.original_retail_price > item.price && (
                            <p className="text-[9px] sm:text-[9.5px] text-emerald-700 font-extrabold mt-1 truncate">
                              ✨ Tarifa Mayorista Aplicada (-{formatPrice(item.original_retail_price - item.price)})
                            </p>
                          )}

                          {productObj?.colors && productObj.colors.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-neutral-400 font-medium">Acabado:</span>
                              <select 
                                value={item.color || productObj.colors[0].name}
                                onChange={(e) => handleColorChange(idx, e.target.value)}
                                className="bg-neutral-50 border border-neutral-300 rounded-md text-[10px] px-1.5 py-0.5 font-semibold"
                              >
                                {productObj.colors.map(c => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, -1)}
                            className="px-2.5 py-1 font-bold hover:bg-neutral-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2.5 font-mono font-bold text-xs">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, 1)}
                            className="px-2.5 py-1 font-bold hover:bg-neutral-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-20 sm:w-24 text-right font-mono font-bold text-brand-black text-xs">
                          {formatPrice(item.price * item.quantity)}
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Financial Calculator Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-3 border-t border-neutral-100">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Costo de Envío (COP)</label>
                <input 
                  type="number"
                  min="0"
                  step="any"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Descuento Especial (COP)</label>
                <input 
                  type="number"
                  min="0"
                  step="any"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono font-bold text-xs text-red-600"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-emerald-800 text-[10px] mb-1">Abono / Pago Parcial (COP)</label>
                <input 
                  type="number"
                  min="0"
                  step="any"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 font-mono font-extrabold text-xs text-emerald-900 focus:outline-none focus:border-emerald-600"
                  placeholder="0"
                />
                <p className="text-[9.5px] text-neutral-500 mt-1">
                  Saldo pendiente: <span className="font-mono font-bold text-amber-700">{formatPrice(Math.max(0, grandTotal - depositAmount))}</span>
                </p>
              </div>

              <div className="bg-neutral-950 text-white p-3.5 rounded-xl flex flex-col justify-between shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Total Final</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                    depositAmount >= grandTotal && grandTotal > 0 ? 'bg-emerald-500 text-white' : depositAmount > 0 ? 'bg-amber-400 text-black' : 'bg-red-500 text-white'
                  }`}>
                    {depositAmount >= grandTotal && grandTotal > 0 ? 'Pago Completo' : depositAmount > 0 ? 'Abono Parcial' : 'Sin Abono'}
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-amber-300">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* STEP 3: CUSTOMER CRM PROFILE */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5 sm:pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-black" /> 3. Perfil de Cliente & Tag CRM
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Nombre Completo *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Arq. Andrés Restrepo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-brand-black text-xs"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Teléfono / WhatsApp *</label>
                <input 
                  type="text"
                  required
                  placeholder="+57 315 000 0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono font-bold text-xs"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Correo Electrónico</label>
                <input 
                  type="email"
                  placeholder="cliente@ejemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-brand-black" /> Categorización de Cliente CRM
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { tag: 'Mayorista', label: 'Mayorista / Distribuidor', color: 'bg-emerald-100/90 text-emerald-950 border-emerald-300' },
                  { tag: 'VIP', label: 'VIP', color: 'bg-amber-100/90 text-amber-950 border-amber-300' },
                  { tag: 'Arquitecto', label: 'Arquitecto / Diseñador', color: 'bg-indigo-100/90 text-indigo-950 border-indigo-300' },
                  { tag: 'Residencial', label: 'Residencial', color: 'bg-emerald-100/90 text-emerald-950 border-emerald-300' },
                  { tag: 'Proyecto Especial', label: 'Contract / Hotelero', color: 'bg-purple-100/90 text-purple-950 border-purple-300' }
                ].map(item => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => handleSelectCustomerTag(item.tag as any)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all shadow-2xs ${item.color} ${
                      customerTag === item.tag ? 'ring-2 ring-brand-black ring-offset-1 font-extrabold scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 4: SHIPPING & PAYMENT DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Shipping Box */}
            <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 sm:p-5 space-y-3 shadow-xs">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2 border-b border-neutral-100 pb-2.5">
                <Truck className="w-4 h-4 text-brand-black" /> Logística & Envío Posventa
              </h3>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Dirección de Entrega</label>
                <input 
                  type="text"
                  placeholder="Calle / Carrera # Apt / Casa"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Ciudad Destino</label>
                  <input 
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Transportadora</label>
                  <select 
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Servientrega">Servientrega</option>
                    <option value="Interrapidísimo">Interrapidísimo</option>
                    <option value="Deprisa / Avianca">Deprisa / Avianca</option>
                    <option value="Flete Privado Luxe">Flete Privado Luxe</option>
                    <option value="Retiro en Showroom">Retiro en Showroom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Número de Guía de Rastreo (Opcional)</label>
                <input 
                  type="text"
                  placeholder="Ej. 9812739182"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Payment & Status Box */}
            <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 sm:p-5 space-y-3 shadow-xs">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2 border-b border-neutral-100 pb-2.5">
                <CreditCard className="w-4 h-4 text-brand-black" /> Pago & Estado Inicial
              </h3>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Pasarela de Pago / Canal</label>
                <select 
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="Transferencia Directa Bancaria">Transferencia Bancaria (Bancolombia / Davivienda)</option>
                  <option value="Wompi Colombia">Wompi Colombia (TC / PSE)</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="Efectivo en Showroom">Efectivo en Showroom</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Método de Pago</label>
                <input 
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Estado de la Orden</label>
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold uppercase"
                >
                  <option value="pending">Pendiente / Por Verificar</option>
                  <option value="processing">En Preparación / Producción</option>
                  <option value="shipped">Despachado / En Tránsito</option>
                  <option value="delivered">Entregado / Posventa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Box */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 sm:p-4">
            <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Notas Internas o Instrucciones Especiales</label>
            <textarea 
              rows={2}
              placeholder="Observaciones de entrega, empaque..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-black"
            ></textarea>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 pt-4 border-t border-neutral-200">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-300 rounded-xl uppercase font-bold text-xs hover:bg-neutral-100 transition-colors min-h-[40px]"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 sm:px-8 py-2.5 bg-brand-black text-white rounded-xl uppercase font-bold text-xs hover:bg-neutral-800 flex items-center justify-center gap-2 shadow-md transition-all min-h-[40px]"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> Confirmar & Registrar Pedido
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
