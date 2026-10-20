import React from 'react';
import { 
  X, 
  Truck, 
  Edit, 
  Trash2,
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  AlertTriangle, 
  Crown, 
  Ruler, 
  Home, 
  Building2,
  Check,
  Package,
  ShoppingBag,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { siigoInvoiceService } from '../../services/siigoInvoiceService';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onEditOrder: (order: Order) => void;
  onDeleteOrder?: (id: string) => void;
}

// Official WhatsApp Brand Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onEditOrder,
  onDeleteOrder
}) => {
  const { formatPrice } = useCurrency();
  const [isGeneratingInvoice, setIsGeneratingInvoice] = React.useState(false);
  const [invoiceFeedback, setInvoiceFeedback] = React.useState<string | null>(null);

  if (!isOpen || !order) return null;

  // Generate WhatsApp Tracking Link
  const getWhatsAppLink = () => {
    const rawPhone = order.customer_phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('57') ? rawPhone : `57${rawPhone}`;
    
    let statusText = 'Pendiente por Verificar';
    if (order.status === 'processing') statusText = 'En Preparación / Taller';
    if (order.status === 'shipped') statusText = 'Despachado en Tránsito';
    if (order.status === 'delivered') statusText = 'Entregado con Éxito';
    if (order.status === 'cancelled') statusText = 'Cancelado';

    const depositVal = order.deposit_amount || 0;
    const pendingVal = order.pending_balance !== undefined ? order.pending_balance : Math.max(0, order.total - depositVal);

    let paymentBreakdown = `• Total Pedido: $${order.total.toLocaleString('es-CO')} COP`;
    if (depositVal > 0) {
      paymentBreakdown += `\n• Abonado: $${depositVal.toLocaleString('es-CO')} COP\n• Saldo Pendiente por Cobrar: $${pendingVal.toLocaleString('es-CO')} COP`;
    }

    const text = `Hola *${order.customer_name}*, te saludamos de *Diseño Tu Espacio - By Alexis Madrigal*.\n\nTe informamos que tu pedido *Ref: ${order.order_ref}* se encuentra en el estado: *${statusText}*.\n\n*Detalles Financieros:*\n${paymentBreakdown}\n\n*Detalles de Logística & Envíos:*\n• Transportadora: ${order.carrier || 'Flete Privado'}\n• Número de Guía: ${order.tracking_number || 'En asignación'}\n• Ciudad Destino: ${order.city || 'Colombia'}\n\nPuedes realizar cualquier consulta posventa respondiendo a este mensaje.\n¡Gracias por elegir diseño de autor!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Stage index helper
  const getStageIndex = (status: Order['status']): number => {
    if (status === 'pending') return 0;
    if (status === 'processing') return 1;
    if (status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const stageIdx = getStageIndex(order.status);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 z-50 animate-fadeIn font-sans">
      <div className="bg-white/95 backdrop-blur-2xl w-[98vw] sm:w-[96vw] max-w-[1600px] h-[95vh] border border-white/80 rounded-2xl sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal Bar */}
        <div className="bg-neutral-900 text-white p-3.5 sm:p-5 md:px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-white/10 rounded-xl sm:rounded-2xl shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold tracking-wider truncate">
                  {order.order_ref}
                </h2>
                <span className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full uppercase border shrink-0 ${
                  order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                  order.status === 'processing' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                  'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1 font-medium truncate">
                <Calendar className="w-3 h-3 shrink-0" /> {order.created_at}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onDeleteOrder && (
              <button
                onClick={() => {
                  if (confirm(`¿Está seguro de eliminar el pedido ${order.order_ref}?`)) {
                    onClose();
                    onDeleteOrder(order.id);
                  }
                }}
                className="p-1.5 sm:px-3.5 sm:py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1 border border-red-500/50 shadow-xs cursor-pointer"
                title="Eliminar pedido permanentemente"
              >
                <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Eliminar</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onEditOrder(order);
              }}
              className="p-1.5 sm:px-3.5 sm:py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1 border border-white/20 cursor-pointer"
              title="Editar orden"
            >
              <Edit className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Stepper Timeline Progress Bar */}
          <div className="bg-neutral-50 p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Línea de Tiempo de Producción & Entrega
            </span>
            
            <div className="relative flex items-center justify-between px-2 sm:px-6 pt-2 pb-2">
              <div className="absolute top-4 left-4 sm:left-8 right-4 sm:right-8 h-0.5 bg-neutral-200 -z-0"></div>
              <div 
                className="absolute top-4 left-4 sm:left-8 h-0.5 bg-neutral-900 transition-all duration-500 -z-0"
                style={{ width: `${(stageIdx / 3) * 100}%` }}
              ></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                  stageIdx >= 0 ? 'bg-neutral-900 text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-700 mt-1">Recibido</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                  stageIdx >= 1 ? 'bg-neutral-900 text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {stageIdx >= 1 ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : '2'}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-700 mt-1">En Taller</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                  stageIdx >= 2 ? 'bg-neutral-900 text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {stageIdx >= 2 ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : '3'}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-700 mt-1">En Tránsito</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                  stageIdx >= 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {stageIdx >= 3 ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : '4'}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-700 mt-1">Entregado</span>
              </div>
            </div>
          </div>

          {/* 2-Column Responsive Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* LEFT COLUMN: Products & Payment / Financial Liquidations (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Purchased Products Detailed List */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 space-y-3.5 shadow-2xs">
                <div className="flex justify-between items-center border-b pb-2.5">
                  <h3 className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-neutral-700" /> Productos en la Orden ({order.items?.length || 0})
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-neutral-500">
                    Total: {formatPrice(order.total)}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50/90 hover:bg-neutral-50 rounded-xl border border-neutral-100 gap-3 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={item.image} alt={item.name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border bg-white shadow-2xs shrink-0" />
                        <div className="min-w-0">
                          <p className="font-extrabold text-neutral-900 text-xs sm:text-sm truncate">{item.name}</p>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            <span className="text-[11px] text-neutral-500 font-medium">
                              {item.quantity} un. • {formatPrice(item.price)} {item.color ? `• Acabado: ${item.color}` : ''}
                            </span>
                            {item.stock_location === 'store' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                                🏬 Tienda Física
                              </span>
                            ) : item.stock_location === 'warehouse' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-100 text-indigo-900 border border-indigo-300">
                                🏭 Bodega Principal
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                🌐 Stock Web
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-neutral-900 text-xs sm:text-sm block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-medium">Subtotal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Gateway & Financial Breakdown */}
              <div className="bg-neutral-900 text-white p-4 sm:p-6 rounded-2xl space-y-3.5 shadow-md">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5 flex-wrap gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-300" /> Pasarela: {order.payment_gateway || 'Transferencia'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">{order.payment_method || 'Pago Realizado'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-1.5 text-[11px] border-b border-neutral-800">
                  <div className="bg-neutral-800/40 p-2.5 sm:p-3 rounded-xl border border-neutral-800">
                    <span className="text-[9.5px] uppercase text-neutral-400 block font-bold">Total Liquidado</span>
                    <span className="font-mono font-bold text-white text-xs sm:text-sm mt-0.5 block">{formatPrice(order.total)}</span>
                  </div>
                  <div className="bg-neutral-800/40 p-2.5 sm:p-3 rounded-xl border border-neutral-800">
                    <span className="text-[9.5px] uppercase text-emerald-400 block font-bold">Abonado (Parcial)</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm mt-0.5 block">{formatPrice(order.deposit_amount || 0)}</span>
                  </div>
                  <div className="bg-neutral-800/40 p-2.5 sm:p-3 rounded-xl border border-neutral-800">
                    <span className="text-[9.5px] uppercase text-amber-400 block font-bold">Saldo Pendiente</span>
                    <span className="font-mono font-extrabold text-amber-300 text-xs sm:text-sm mt-0.5 block">{formatPrice(order.pending_balance !== undefined ? order.pending_balance : Math.max(0, order.total - (order.deposit_amount || 0)))}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">Estado del Pago</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-md inline-block border ${
                      (order.deposit_amount || 0) >= order.total && order.total > 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : (order.deposit_amount || 0) > 0
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}>
                      {(order.deposit_amount || 0) >= order.total && order.total > 0 ? '✓ Pago Completo (100%)' : (order.deposit_amount || 0) > 0 ? '⏳ Abono Parcial Registrado' : '⚠️ Pendiente de Pago (0%)'}
                    </span>
                  </div>

                  {/* Direct WhatsApp Action Pill inside Modal */}
                  <a 
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE57] text-white font-extrabold text-xs flex items-center justify-center gap-2 rounded-full shadow-lg shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap min-h-[40px]"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                    <span>Enviar estado por WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Customer Profile, Logistics, Notes, Siigo (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Customer Information Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-700" /> Perfil de Cliente
                  </span>
                  {order.customer_tag && (
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider border shadow-2xs flex items-center gap-1 ${
                      order.customer_tag === 'VIP' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                      order.customer_tag === 'Arquitecto' ? 'bg-indigo-100 text-indigo-950 border-indigo-300' :
                      order.customer_tag === 'Residencial' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                      'bg-purple-100 text-purple-950 border-purple-300'
                    }`}>
                      {order.customer_tag === 'VIP' && <><Crown className="w-2.5 h-2.5 text-amber-600" /> VIP</>}
                      {order.customer_tag === 'Arquitecto' && <><Ruler className="w-2.5 h-2.5 text-indigo-600" /> Arq</>}
                      {order.customer_tag === 'Residencial' && <><Home className="w-2.5 h-2.5 text-emerald-600" /> Res</>}
                      {order.customer_tag === 'Proyecto Especial' && <><Building2 className="w-2.5 h-2.5 text-purple-600" /> Contract</>}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-neutral-800">
                  <p className="font-extrabold text-sm sm:text-base text-neutral-900">{order.customer_name}</p>
                  <div className="flex items-center gap-2 text-neutral-600 text-xs">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="font-semibold">{order.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 text-xs">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{order.customer_email || 'Sin registrar'}</span>
                  </div>
                </div>
              </div>

              {/* Logistics & Shipping Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 space-y-3 shadow-2xs">
                <div className="border-b pb-2">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-neutral-700" /> Logística & Despacho
                  </span>
                </div>

                <div className="space-y-2 text-neutral-800">
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{order.shipping_address || 'Retiro en Showroom'}</p>
                      <p className="text-neutral-500 font-medium">{order.city || 'Bogotá D.C., Colombia'}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex justify-between text-xs">
                    <span className="text-neutral-400 font-medium">Transportadora:</span>
                    <span className="font-bold">{order.carrier || 'No asignada'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400 font-medium">Guía de Rastreo:</span>
                    <span className="font-bold text-neutral-900 truncate">{order.tracking_number || 'En asignación'}</span>
                  </div>
                </div>
              </div>

              {/* Notes callout if present */}
              {order.notes && (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200 text-amber-950 rounded-2xl flex items-start gap-2.5 font-medium text-xs shadow-2xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-900 font-bold mb-0.5">Observación del Pedido:</strong>
                    <span>{order.notes}</span>
                  </div>
                </div>
              )}

              {/* Electronic Invoicing Siigo Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Facturación Electrónica (Siigo / DIAN)
                  </span>
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider border shadow-2xs ${
                    order.siigo_invoice_status === 'generated'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : order.siigo_invoice_status === 'failed'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : order.payment_method?.toLowerCase().includes('efectivo') || order.payment_gateway?.toLowerCase().includes('efectivo')
                      ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {order.siigo_invoice_status === 'generated'
                      ? '✓ Factura Emitida'
                      : order.siigo_invoice_status === 'failed'
                      ? '⚠️ Error de Emisión'
                      : order.payment_method?.toLowerCase().includes('efectivo') || order.payment_gateway?.toLowerCase().includes('efectivo')
                      ? 'No Aplica (Efectivo)'
                      : 'Pendiente de Emisión'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-neutral-500 font-medium text-[11px]">
                      Consecutivo Fiscal: <strong className="text-neutral-900">{order.siigo_invoice_number || 'Aún no asignado'}</strong>
                    </p>
                    {order.customer_document_id && (
                      <p className="text-neutral-500 text-[10px]">
                        Documento: <strong>{order.customer_document_type || 'CC'} {order.customer_document_id}</strong>
                      </p>
                    )}
                    {order.siigo_error_log && (
                      <p className="text-red-600 text-[10px] font-medium max-w-md">
                        Detalle: {order.siigo_error_log}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {order.siigo_pdf_url && (
                      <a
                        href={order.siigo_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-neutral-300"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </a>
                    )}

                    {/* Si no es efectivo, permitir emitir o reintentar factura en Siigo */}
                    {!(order.payment_method?.toLowerCase().includes('efectivo') || order.payment_gateway?.toLowerCase().includes('efectivo')) && (
                      <button
                        disabled={isGeneratingInvoice}
                        onClick={async () => {
                          setIsGeneratingInvoice(true);
                          setInvoiceFeedback(null);
                          try {
                            const res = await siigoInvoiceService.generateInvoiceForOrder(order);
                            setInvoiceFeedback(`¡Factura ${res.invoiceNumber} generada en Siigo!`);
                          } catch (err: any) {
                            setInvoiceFeedback(err.message || 'Error al conectar con Siigo');
                          } finally {
                            setIsGeneratingInvoice(false);
                          }
                        }}
                        className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingInvoice ? (
                          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando Siigo...</>
                        ) : order.siigo_invoice_status === 'generated' ? (
                          <><FileText className="w-3.5 h-3.5" /> Reenviar a Siigo</>
                        ) : (
                          <><FileText className="w-3.5 h-3.5" /> Emitir Factura Siigo</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {invoiceFeedback && (
                  <p className={`text-[11px] font-medium pt-1 border-t ${invoiceFeedback.includes('¡Factura') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {invoiceFeedback}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-neutral-100 border-t border-neutral-200 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditOrder(order);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-full font-bold text-xs uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 min-h-[38px]"
            >
              <Edit className="w-3.5 h-3.5" /> Editar Orden Completa
            </button>
            {onDeleteOrder && (
              <button
                onClick={() => {
                  if (confirm(`¿Está seguro de eliminar el pedido ${order.order_ref}?`)) {
                    onClose();
                    onDeleteOrder(order.id);
                  }
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-full font-bold text-xs uppercase transition-colors border border-red-200 flex items-center justify-center gap-1.5 min-h-[38px]"
                title="Eliminar pedido"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar Pedido
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-900 text-white rounded-full font-bold text-xs uppercase hover:bg-black transition-colors min-h-[38px]"
          >
            Cerrar Detalle
          </button>
        </div>

      </div>
    </div>
  );
};
