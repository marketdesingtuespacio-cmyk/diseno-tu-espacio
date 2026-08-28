import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { shippingService } from '../services/shippingService';

export type PaymentGateway = 'wompi' | 'mercadopago' | 'stripe' | 'pse' | 'nequi';

interface PaymentProviderConfig {
  id: PaymentGateway;
  name: string;
  subtitle: string;
  badge: string;
  icons: string[];
  methods: string[];
}

const PAYMENT_PROVIDERS: PaymentProviderConfig[] = [
  {
    id: 'wompi',
    name: 'Wompi Colombia (Bancolombia)',
    subtitle: 'Pago local seguro en Colombia: Tarjetas, PSE, Nequi y Daviplata',
    badge: 'Recomendado Colombia',
    icons: ['💳', '🏦', '📱'],
    methods: ['Tarjeta de Crédito / Débito', 'PSE (Débito Bancario)', 'Nequi / Daviplata', 'Botón Bancolombia']
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    subtitle: 'Paga con tu cuenta de Mercado Pago o tarjetas en cuotas sin interés',
    badge: 'Popula América Latina',
    icons: ['🤝', '💳'],
    methods: ['Cuenta Mercado Pago', 'Tarjetas en Cuotas', 'Efecty / Puntos de Pago']
  },
  {
    id: 'stripe',
    name: 'Stripe International',
    subtitle: 'Pago internacional seguro para tarjetas globales y Apple/Google Pay',
    badge: 'Global (USD/EUR)',
    icons: ['🌐', '💳', ''],
    methods: ['Visa / Mastercard / AMEX Global', 'Apple Pay', 'Google Pay']
  },
  {
    id: 'pse',
    name: 'PSE (Pagos Seguros en Línea)',
    subtitle: 'Transferencia directa desde cualquier banco colombiano',
    badge: 'Débito Bancario',
    icons: ['🏦'],
    methods: ['Cualquier Banco de Colombia (Bancolombia, Davivienda, BBVA, etc.)']
  }
];

export const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const shippingRates = shippingService.getRates();

  // Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    documentId: '', // CC / NIT required for Wompi / MercadoPago
    address: '',
    cityRateId: shippingRates[0].id,
    notes: ''
  });

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('wompi');
  const [selectedSubMethod, setSelectedSubMethod] = useState<string>('Tarjeta de Crédito / Débito');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  // Calculate dynamic shipping rate
  const selectedCityRate = shippingRates.find(r => r.id === shippingForm.cityRateId) || shippingRates[0];
  const shippingCost = totalPrice > 1500000 ? 0 : selectedCityRate.cost;
  const grandTotal = totalPrice + shippingCost;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate multi-gateway API transaction call
    setTimeout(() => {
      const orderRef = `DT-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderCompleted({
        orderRef,
        customer: shippingForm.fullName,
        email: shippingForm.email,
        gateway: selectedGateway,
        gatewayName: PAYMENT_PROVIDERS.find(p => p.id === selectedGateway)?.name,
        method: selectedSubMethod,
        total: grandTotal,
        itemsCount: cart.length
      });
      clearCart();
      setIsProcessing(false);
    }, 2000);
  };

  if (orderCompleted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 font-sans">
        <div className="bg-brand-surface border border-brand-black p-8 md:p-12 text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto stroke-[1.5]" />
          
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Transacción Exitosa
            </span>
            <h1 className="text-2xl font-light text-brand-black">
              ¡Gracias por tu compra en Diseño Tu Espacio!
            </h1>
          </div>

          <div className="bg-white p-6 border border-brand-border text-left space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500 font-bold uppercase">Referencia de Pedido:</span>
              <span className="font-mono font-bold text-brand-black">{orderCompleted.orderRef}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500 font-bold uppercase">Pasarela de Pago:</span>
              <span className="font-medium text-brand-black">{orderCompleted.gatewayName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500 font-bold uppercase">Método Seleccionado:</span>
              <span className="font-medium text-brand-black">{orderCompleted.method}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500 font-bold uppercase">Cliente:</span>
              <span className="font-medium text-brand-black">{orderCompleted.customer} ({orderCompleted.email})</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1">
              <span>Total Pagado:</span>
              <span>{formatPrice(orderCompleted.total)}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-lg mx-auto">
            Hemos enviado el comprobante oficial de pago e instrucciones de seguimiento a <strong>{orderCompleted.email}</strong>. Tu pedido se encuentra en preparación para despacho asegurado.
          </p>

          <div className="pt-4 flex gap-4 justify-center">
            <Link 
              to="/catalog"
              className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3.5 px-8 hover:bg-neutral-800 transition-colors"
            >
              Seguir Explorando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-light">Tu Bolsa de Compras está Vacía</h2>
        <p className="text-xs text-neutral-500">Agrega piezas de iluminación a tu bolsa para proceder al pago seguro.</p>
        <Link to="/catalog" className="inline-block bg-brand-black text-white text-xs uppercase font-bold tracking-widest py-3.5 px-8">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  const currentProvider = PAYMENT_PROVIDERS.find(p => p.id === selectedGateway)!;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border pb-6 mb-10">
        <div>
          <Link to="/catalog" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black uppercase font-bold mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Tienda
          </Link>
          <h1 className="text-3xl font-light text-brand-black tracking-tight">
            Pasarela de Pago Multi-Gateway
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 bg-brand-surface p-2 border border-brand-border">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Encriptación SSL 256-bit • Pagos PCI-DSS Compliance</span>
        </div>
      </div>

      <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Shipping Info & Payment Gateway Selector */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Section 1: Customer Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-black text-white text-[10px] flex items-center justify-center">1</span>
              Datos de Envío & Facturación
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Sofía Alarcón"
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  required
                  placeholder="sofia@ejemplo.com"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Teléfono Móvil *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+57 300 000 0000"
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Documento Identidad (CC / NIT) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="1.020.304.050"
                  value={shippingForm.documentId}
                  onChange={(e) => setShippingForm({ ...shippingForm, documentId: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block uppercase font-bold text-neutral-500 mb-1">Dirección de Entrega *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Calle 93 # 12-45, Apto / Suite"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block uppercase font-bold text-neutral-500 mb-1">Ciudad & Destino de Envío (Colombia) *</label>
                <select 
                  value={shippingForm.cityRateId}
                  onChange={(e) => setShippingForm({ ...shippingForm, cityRateId: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold text-brand-black focus:outline-none focus:border-brand-black"
                >
                  {shippingRates.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.city} ({r.department}) — {totalPrice > 1500000 ? 'Envío GRATIS' : formatPrice(r.cost)} ({r.deliveryDays})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Tiempo estimado de entrega para {selectedCityRate.city}: <strong>{selectedCityRate.deliveryDays}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Multi-Gateway Payment Selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-black text-white text-[10px] flex items-center justify-center">2</span>
              Seleccione la Pasarela de Pago
            </h3>

            <div className="space-y-3">
              {PAYMENT_PROVIDERS.map((provider) => (
                <div 
                  key={provider.id}
                  onClick={() => {
                    setSelectedGateway(provider.id);
                    setSelectedSubMethod(provider.methods[0]);
                  }}
                  className={`cursor-pointer p-4 border transition-all ${
                    selectedGateway === provider.id 
                      ? 'border-brand-black bg-brand-surface shadow-subtle' 
                      : 'border-brand-border hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentGateway"
                        checked={selectedGateway === provider.id}
                        onChange={() => {}}
                        className="accent-black w-4 h-4"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-brand-black">{provider.name}</h4>
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-brand-black text-white px-2 py-0.5">
                            {provider.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-light mt-0.5">{provider.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-base flex gap-1">
                      {provider.icons.map((icon, i) => <span key={i}>{icon}</span>)}
                    </div>
                  </div>

                  {/* Sub-Methods Option List when Gateway is Active */}
                  {selectedGateway === provider.id && (
                    <div className="mt-4 pt-3 border-t border-neutral-300 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {provider.methods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubMethod(method);
                          }}
                          className={`p-2 text-left border text-[11px] font-medium transition-colors ${
                            selectedSubMethod === method 
                              ? 'bg-brand-black text-white border-brand-black' 
                              : 'bg-white border-brand-border text-neutral-700 hover:border-black'
                          }`}
                        >
                          ✓ {method}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Gateway Specific Form Mock Notice */}
            <div className="bg-brand-surface p-4 border border-brand-border text-xs text-neutral-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-black uppercase">
                <Info className="w-4 h-4 text-brand-black" />
                Integración de pasarela activa: {currentProvider.name}
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Al hacer clic en "Confirmar y Pagar", serás redirigido al ambiente seguro encriptado de <strong>{currentProvider.name}</strong> para procesar mediante <strong>{selectedSubMethod}</strong>.
              </p>
            </div>

          </div>

          {/* Submit Action Button */}
          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-4 px-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-elevated"
          >
            {isProcessing ? (
              <span>Procesando pago encriptado...</span>
            ) : (
              <span>Confirmar & Pagar {formatPrice(grandTotal)} con {currentProvider.name}</span>
            )}
          </button>

        </div>

        {/* RIGHT COLUMN: Order Summary Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-surface border border-brand-border p-6 lg:sticky lg:top-28 space-y-6">
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
              Resumen de la Compra ({cart.length} piezas)
            </h3>

            {/* Cart Item Thumbnails List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-brand-border">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-14 h-16 object-cover border border-brand-border bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-brand-black line-clamp-1">{item.product.name}</h4>
                      <span className="text-[10px] text-neutral-400">Cant: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-brand-black">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-brand-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal Artículos</span>
                <span className="font-medium text-brand-black">{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Envío Asegurado</span>
                <span className="font-medium text-brand-black">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">GRATIS</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>

              <div className="flex justify-between border-t border-neutral-300 pt-3 text-sm font-bold text-brand-black">
                <span>Total a Cancelar ({currency})</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Security Badges */}
            <div className="bg-white p-3 border border-brand-border text-[10px] text-neutral-500 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-neutral-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Garantía de Satisfacción 100%
              </div>
              <p>Envío protegido en empaque térmico y acolchado técnico para luminarias de cristal y metal.</p>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
