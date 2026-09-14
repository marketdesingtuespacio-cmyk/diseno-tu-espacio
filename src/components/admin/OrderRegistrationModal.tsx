import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
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

  // Add Product to Cart/Items list
  const handleAddProduct = (product: Product) => {
    const existingIndex = items.findIndex(i => i.product_id === product.id);
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
          price: product.price,
          quantity: 1,
          color: selectedColor
        }
      ]);
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

    await orderService.createOrder({
      order_ref: orderRef,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || 'cliente@diseñotuespacio.com',
      customer_phone: customerPhone.trim(),
      customer_tag: customerTag,
      shipping_address: shippingAddress.trim(),
      city: city.trim(),
      carrier,
      tracking_number: trackingNumber.trim(),
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total: grandTotal,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white max-w-5xl w-full border border-brand-black shadow-modal my-8 text-xs font-sans">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center bg-brand-black text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest">
                Registro Inteligente de Pedido & CRM Posventa
              </h2>
              <p className="text-[10px] text-neutral-400 font-light">
                Diseño Tu Espacio — Sistema de Alta de Órdenes Directas y Gestión de Clientes
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 transition-colors text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: VISUAL PRODUCT SELECTOR */}
          <div className="bg-brand-surface p-5 border border-brand-border space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-brand-black" />
                <h3 className="font-bold uppercase tracking-wider text-brand-black">
                  1. Selección Visual de Productos (Catálogo Directo)
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                {products.length} productos en inventario
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input 
                type="text"
                placeholder="Buscar por nombre de producto o categoría (ej. Lámpara de Pie, Cúpula)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-brand-border text-xs focus:outline-none focus:border-brand-black font-medium"
              />
            </div>

            {/* Visual Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="bg-white border border-brand-border p-2 cursor-pointer hover:border-brand-black transition-all flex flex-col justify-between group relative"
                >
                  <div className="aspect-[4/5] bg-brand-surface mb-2 overflow-hidden relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-mono px-1.5 py-0.5">
                      {product.stock} u.
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[11px] text-brand-black truncate">{product.name}</h4>
                    <p className="text-[10px] text-neutral-500 truncate">{product.category}</p>
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-brand-border">
                      <span className="font-bold text-brand-black">{formatPrice(product.price)}</span>
                      <span className="bg-amber-100 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded-none flex items-center gap-1 group-hover:bg-amber-400">
                        <Plus className="w-3 h-3" /> Añadir
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: SELECTED LINE ITEMS & FINANCIAL RECAP */}
          <div className="bg-white border border-brand-border p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> 2. Productos Seleccionados en la Orden ({items.length})
              </h3>
              <span className="text-[11px] font-bold text-emerald-800">
                Subtotal: {formatPrice(subtotal)}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-neutral-300 text-neutral-400">
                No has seleccionado ningún producto. Haz clic en un producto del panel superior para añadirlo.
              </div>
            ) : (
              <div className="divide-y border border-brand-border max-h-40 overflow-y-auto">
                {items.map((item, idx) => {
                  const productObj = products.find(p => p.id === item.product_id);
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4 hover:bg-brand-surface/50">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-12 object-cover border" />
                        <div>
                          <p className="font-bold text-brand-black">{item.name}</p>
                          <p className="text-[10px] text-neutral-500">{formatPrice(item.price)} unitario</p>
                          {productObj?.colors && productObj.colors.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] text-neutral-400">Acabado:</span>
                              <select 
                                value={item.color || productObj.colors[0].name}
                                onChange={(e) => handleColorChange(idx, e.target.value)}
                                className="bg-brand-surface border border-neutral-300 text-[10px] px-1 py-0.5 font-semibold"
                              >
                                {productObj.colors.map(c => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-brand-border bg-white">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, -1)}
                            className="px-2 py-1 font-bold hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <span className="px-3 font-mono font-bold">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, 1)}
                            className="px-2 py-1 font-bold hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-24 text-right font-bold text-brand-black">
                          {formatPrice(item.price * item.quantity)}
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-neutral-400 hover:text-red-600"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-brand-border">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Costo de Envío (COP)</label>
                <input 
                  type="number"
                  min="0"
                  step="5000"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  className="w-full bg-brand-surface border border-brand-border p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Descuento Especial (COP)</label>
                <input 
                  type="number"
                  min="0"
                  step="10000"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-brand-surface border border-brand-border p-2 font-mono font-bold text-red-600"
                />
              </div>

              <div className="bg-brand-black text-white p-3 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Total Final de la Orden</span>
                <span className="text-xl font-bold text-amber-300">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* STEP 3: CUSTOMER CRM PROFILE */}
          <div className="bg-white border border-brand-border p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> 3. Perfil de Cliente & Tag CRM
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Nombre Completo *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Arq. Andrés Restrepo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold text-brand-black"
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
                  className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Correo Electrónico</label>
                <input 
                  type="email"
                  placeholder="cliente@ejemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border p-2.5"
                />
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Categorización de Cliente CRM
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: 'VIP', label: '👑 Cliente VIP', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                  { tag: 'Arquitecto', label: '📐 Arquitecto / Diseñador', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
                  { tag: 'Residencial', label: '🏡 Cliente Residencial', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                  { tag: 'Proyecto Especial', label: '🏢 Proyecto Contract / Hotelero', color: 'bg-purple-100 text-purple-900 border-purple-300' }
                ].map(item => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setCustomerTag(item.tag as any)}
                    className={`px-3 py-1.5 border text-xs font-bold transition-all ${item.color} ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Box */}
            <div className="bg-white border border-brand-border p-5 space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black flex items-center gap-2 border-b border-brand-border pb-2">
                <Truck className="w-4 h-4" /> Logística & Envío Posventa
              </h3>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Dirección de Entrega</label>
                <input 
                  type="text"
                  placeholder="Calle / Carrera # Apt / Casa"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Ciudad Destino</label>
                  <input 
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-border p-2"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Transportadora</label>
                  <select 
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-border p-2 font-bold"
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
                  className="w-full bg-brand-surface border border-brand-border p-2 font-mono font-bold"
                />
              </div>
            </div>

            {/* Payment & Status Box */}
            <div className="bg-white border border-brand-border p-5 space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black flex items-center gap-2 border-b border-brand-border pb-2">
                <CreditCard className="w-4 h-4" /> Pago & Estado Inicial
              </h3>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Pasarela de Pago / Canal</label>
                <select 
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border p-2 font-bold"
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
                  className="w-full bg-brand-surface border border-brand-border p-2"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Estado de la Orden</label>
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as any)}
                  className="w-full bg-brand-surface border border-brand-border p-2 font-bold uppercase"
                >
                  <option value="pending">🕒 Pendiente / Por Verificar</option>
                  <option value="processing">📦 En Preparación / Producción</option>
                  <option value="shipped">🚚 Despachado / En Tránsito</option>
                  <option value="delivered">✅ Entregado / Posventa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Box */}
          <div>
            <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Notas Internas o Instrucciones Especiales</label>
            <textarea 
              rows={2}
              placeholder="Escribe aquí observaciones sobre acabados personalizados, empaque de regalo, horarios de entrega..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border p-2.5 text-xs"
            ></textarea>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-brand-border">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-brand-border uppercase font-bold text-xs hover:bg-brand-surface"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-brand-black text-white uppercase font-bold text-xs hover:bg-neutral-800 flex items-center gap-2 shadow-subtle"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> Confirmar & Registrar Pedido
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
