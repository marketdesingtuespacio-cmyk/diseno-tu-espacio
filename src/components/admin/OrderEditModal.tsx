import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Trash2, 
  Plus, 
  ShoppingBag, 
  UserCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Tag,
  Search
} from 'lucide-react';
import { Product, OrderItem, Order } from '../../types';
import { orderService } from '../../services/orderService';
import { useCurrency } from '../../context/CurrencyContext';

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
  products: Product[];
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  order,
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
  const [city, setCity] = useState('');
  const [carrier, setCarrier] = useState('Servientrega');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Order Items & Financials State
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // Payment & Status State
  const [paymentGateway, setPaymentGateway] = useState('Transferencia Directa Bancaria');
  const [paymentMethod, setPaymentMethod] = useState('Consignación / Efectivo Showroom');
  const [orderStatus, setOrderStatus] = useState<Order['status']>('processing');

  // Add product search in edit modal
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (order) {
      setCustomerName(order.customer_name || '');
      setCustomerEmail(order.customer_email || '');
      setCustomerPhone(order.customer_phone || '');
      setCustomerTag(order.customer_tag || 'Residencial');
      setNotes(order.notes || '');

      setShippingAddress(order.shipping_address || '');
      setCity(order.city || 'Bogotá D.C.');
      setCarrier(order.carrier || 'Servientrega');
      setTrackingNumber(order.tracking_number || '');

      setItems(order.items || []);
      setShippingCost(order.shipping_cost ?? 0);
      setDiscount(order.discount ?? 0);

      setPaymentGateway(order.payment_gateway || 'Transferencia Directa Bancaria');
      setPaymentMethod(order.payment_method || 'Consignación / Efectivo Showroom');
      setOrderStatus(order.status || 'processing');
    }
  }, [order]);

  if (!isOpen || !order) return null;

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

  // Submit Order Updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return alert('Por favor ingrese el nombre completo del cliente.');
    if (!customerPhone.trim()) return alert('Por favor ingrese el teléfono del cliente.');

    await orderService.updateOrder(order.id, {
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
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
      notes: notes.trim()
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
      <div className="bg-white/95 backdrop-blur-2xl max-w-5xl w-full border border-white/80 rounded-2xl shadow-2xl my-8 text-xs overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center bg-neutral-950 text-white px-6 py-4.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded-xl">
              <Edit3 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                Editar Pedido — <span className="font-mono text-amber-300">{order.order_ref}</span>
              </h2>
              <p className="text-[10px] text-neutral-400 font-light">
                Modifica dirección de entrega, cliente, guía de despacho, ítems o estado de la orden
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 transition-colors text-neutral-300 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* STEP 1: CUSTOMER PROFILE & CRM */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-black" /> 1. Datos del Cliente & Etiqueta CRM
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Nombre Completo *</label>
                <input 
                  type="text"
                  required
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
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Correo Electrónico</label>
                <input 
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-brand-black" /> Categoría de Cliente CRM
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: 'VIP', label: 'Cliente VIP', color: 'bg-amber-100/90 text-amber-950 border-amber-300' },
                  { tag: 'Arquitecto', label: 'Arquitecto / Diseñador', color: 'bg-indigo-100/90 text-indigo-950 border-indigo-300' },
                  { tag: 'Residencial', label: 'Cliente Residencial', color: 'bg-emerald-100/90 text-emerald-950 border-emerald-300' },
                  { tag: 'Proyecto Especial', label: 'Proyecto Contract / Hotelero', color: 'bg-purple-100/90 text-purple-950 border-purple-300' }
                ].map(item => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setCustomerTag(item.tag as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${item.color} ${
                      customerTag === item.tag ? 'ring-2 ring-brand-black ring-offset-1 font-extrabold scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: SHIPPING & LOGISTICS */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Truck className="w-4 h-4 text-brand-black" /> 2. Dirección de Entrega & Logística de Despacho
            </h3>

            <div>
              <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Dirección Exacta de Entrega *</label>
              <input 
                type="text"
                required
                placeholder="Calle / Carrera # Apt / Casa / Edificio"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-semibold text-brand-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Ciudad / Municipio *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Medellín, Bogotá, Cali..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Empresa Transportadora</label>
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

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Número de Guía de Rastreo</label>
                <input 
                  type="text"
                  placeholder="Ej. 9812739182"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: ITEMS IN ORDER */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-black" /> 3. Productos Incluidos ({items.length})
              </h3>
              <button 
                type="button"
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="text-xs font-bold text-brand-black uppercase bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {isAddingProduct ? 'Cerrar Buscador' : 'Añadir Producto de Catálogo'}
              </button>
            </div>

            {/* Product Selector Dropdown if Adding Product */}
            {isAddingProduct && (
              <div className="p-3 bg-neutral-100/80 rounded-xl space-y-2 border border-neutral-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input 
                    type="text"
                    placeholder="Buscar producto a incluir..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                  {filteredProducts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handleAddProduct(p)}
                      className="p-2 bg-white border rounded-lg hover:border-black cursor-pointer flex items-center gap-2"
                    >
                      <img src={p.images[0]} alt="" className="w-7 h-8 object-cover rounded" />
                      <div className="truncate text-[10px]">
                        <p className="font-bold truncate">{p.name}</p>
                        <p className="font-mono">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-neutral-300 rounded-xl text-neutral-400 text-xs">
                No hay productos en esta orden.
              </div>
            ) : (
              <div className="divide-y border border-neutral-200/80 rounded-xl bg-white max-h-40 overflow-y-auto">
                {items.map((item, idx) => {
                  const productObj = products.find(p => p.id === item.product_id);
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4 hover:bg-neutral-50/80">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg border bg-white shadow-2xs" />
                        <div>
                          <p className="font-bold text-brand-black">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">{formatPrice(item.price)} u.</p>
                          {productObj?.colors && productObj.colors.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-neutral-400">Acabado:</span>
                              <select 
                                value={item.color || productObj.colors[0].name}
                                onChange={(e) => handleColorChange(idx, e.target.value)}
                                className="bg-neutral-50 border border-neutral-300 rounded text-[10px] px-1.5 py-0.5 font-semibold"
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
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, -1)}
                            className="px-2.5 py-1 font-bold hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <span className="px-3 font-mono font-bold text-xs">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, 1)}
                            className="px-2.5 py-1 font-bold hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-24 text-right font-mono font-bold text-brand-black">
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

            {/* Financial Calculator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-neutral-100">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Costo de Envío (COP)</label>
                <input 
                  type="number"
                  min="0"
                  step="5000"
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
                  step="10000"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono font-bold text-xs text-red-600"
                />
              </div>

              <div className="bg-neutral-950 text-white p-3.5 rounded-xl flex flex-col justify-between shadow-md">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Total Final Actualizado</span>
                <span className="text-xl font-bold font-mono text-amber-300">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* STEP 4: PAYMENT & STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2 border-b border-neutral-100 pb-2.5">
                <CreditCard className="w-4 h-4 text-brand-black" /> Pasarela & Pago
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
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>
            </div>

            <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2 border-b border-neutral-100 pb-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-black" /> Estado de la Orden
              </h3>

              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Estado Actual</label>
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold uppercase"
                >
                  <option value="pending">Pendiente por Verificar</option>
                  <option value="processing">En Preparación / Taller</option>
                  <option value="shipped">Despachado / En Tránsito</option>
                  <option value="delivered">Entregado / Posventa</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Box */}
          <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-4">
            <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Notas Internas o Instrucciones Especiales</label>
            <textarea 
              rows={2}
              placeholder="Instrucciones especiales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-black"
            ></textarea>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-neutral-200">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-300 rounded-xl uppercase font-bold text-xs hover:bg-neutral-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-brand-black text-white rounded-xl uppercase font-bold text-xs hover:bg-neutral-800 flex items-center gap-2 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> Guardar Cambios del Pedido
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
