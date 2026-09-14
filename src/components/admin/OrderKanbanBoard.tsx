import React, { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  ArrowLeft, 
  Edit, 
  Check, 
  X,
  AlertTriangle,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Crown,
  Ruler,
  Home,
  Building2,
  Edit3
} from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { orderService } from '../../services/orderService';

// Official WhatsApp Brand Icon Component
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface OrderKanbanBoardProps {
  orders: Order[];
  onOrderUpdated: () => void;
  onEditOrder: (order: Order) => void;
}

// Columns definition with Vibrant Header Ticket Colors matching Image 2
const KANBAN_COLUMNS: { 
  id: Order['status']; 
  title: string; 
  icon: React.ElementType; 
  headerBg: string; 
  headerTextColor: string;
  pillBg: string;
}[] = [
  { 
    id: 'pending', 
    title: 'Pendientes por Verificar', 
    icon: Clock, 
    headerBg: 'bg-[#E5FF53]', // Lime Yellow from Image 2
    headerTextColor: 'text-neutral-950',
    pillBg: 'bg-yellow-100 text-yellow-900 border-yellow-300' 
  },
  { 
    id: 'processing', 
    title: 'En Preparación / Taller', 
    icon: Package, 
    headerBg: 'bg-[#5B75FF]', // Indigo Blue from Image 2
    headerTextColor: 'text-white',
    pillBg: 'bg-blue-100 text-blue-900 border-blue-300' 
  },
  { 
    id: 'shipped', 
    title: 'Despachados / En Tránsito', 
    icon: Truck, 
    headerBg: 'bg-[#6EE7B7]', // Mint Emerald from Image 2
    headerTextColor: 'text-neutral-950',
    pillBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' 
  },
  { 
    id: 'delivered', 
    title: 'Entregados / Posventa', 
    icon: CheckCircle2, 
    headerBg: 'bg-[#F472B6]', // Pink Magenta from Image 2
    headerTextColor: 'text-white',
    pillBg: 'bg-pink-100 text-pink-900 border-pink-300' 
  },
  { 
    id: 'cancelled', 
    title: 'Cancelados', 
    icon: XCircle, 
    headerBg: 'bg-[#9CA3AF]', // Neutral Grey
    headerTextColor: 'text-white',
    pillBg: 'bg-neutral-200 text-neutral-800 border-neutral-300' 
  }
];

export const OrderKanbanBoard: React.FC<OrderKanbanBoardProps> = ({ orders, onOrderUpdated, onEditOrder }) => {
  const { formatPrice } = useCurrency();

  // State for Editing Carrier/Tracking
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editCarrier, setEditCarrier] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');

  // Handle status step move
  const handleMoveStatus = async (orderId: string, newStatus: Order['status']) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    onOrderUpdated();
  };

  // Open Edit Logistics Modal
  const openEditLogistics = (order: Order) => {
    setEditingOrder(order);
    setEditCarrier(order.carrier || 'Servientrega');
    setEditTrackingNumber(order.tracking_number || '');
  };

  // Save Logistics Edit
  const handleSaveLogistics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    await orderService.updateOrder(editingOrder.id, {
      carrier: editCarrier,
      tracking_number: editTrackingNumber
    });
    setEditingOrder(null);
    onOrderUpdated();
  };

  // Generate WhatsApp Message Link
  const getWhatsAppLink = (order: Order) => {
    const rawPhone = order.customer_phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('57') ? rawPhone : `57${rawPhone}`;
    
    let statusText = 'Pendiente por Verificar';
    if (order.status === 'processing') statusText = 'En Preparación / Taller';
    if (order.status === 'shipped') statusText = 'Despachado en Tránsito';
    if (order.status === 'delivered') statusText = 'Entregado con Éxito';
    if (order.status === 'cancelled') statusText = 'Cancelado';

    const text = `Hola *${order.customer_name}*, te saludamos de *Diseño Tu Espacio - By Alexis Madrigal*.\n\nTe informamos que tu pedido *Ref: ${order.order_ref}* se encuentra en el estado: *${statusText}*.\n\n*Detalles de Logística & Envíos:*\n• Transportadora: ${order.carrier || 'Flete Privado'}\n• Número de Guía: ${order.tracking_number || 'En asignación'}\n• Ciudad Destino: ${order.city || 'Colombia'}\n\nPuedes realizar cualquier consulta posventa respondiendo a este mensaje.\n¡Gracias por elegir diseño de autor!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Next status helper
  const getNextStatus = (current: Order['status']): Order['status'] | null => {
    if (current === 'pending') return 'processing';
    if (current === 'processing') return 'shipped';
    if (current === 'shipped') return 'delivered';
    return null;
  };

  // Previous status helper
  const getPrevStatus = (current: Order['status']): Order['status'] | null => {
    if (current === 'delivered') return 'shipped';
    if (current === 'shipped') return 'processing';
    if (current === 'processing') return 'pending';
    return null;
  };

  // Helper for Stepper Stage Index
  const getStageIndex = (status: Order['status']): number => {
    if (status === 'pending') return 0;
    if (status === 'processing') return 1;
    if (status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Kanban Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {KANBAN_COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          const colTotalCOP = colOrders.reduce((acc, o) => acc + o.total, 0);

          const ColIcon = col.icon;

          return (
            <div 
              key={col.id} 
              className="bg-[#F3F3F5] border border-white/80 rounded-[28px] flex flex-col min-h-[550px] shadow-xs overflow-hidden p-2"
            >
              
              {/* Column Header Card */}
              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60 shadow-2xs flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-neutral-900 text-[11px] flex items-center gap-1.5">
                    <ColIcon className="w-3.5 h-3.5 shrink-0 text-neutral-700" /> {col.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 font-medium">
                    {formatPrice(colTotalCOP)}
                  </p>
                </div>
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold shadow-xs">
                  {colOrders.length}
                </span>
              </div>

              {/* Column Body: Ticket Cards Container */}
              <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[780px] px-0.5">
                {colOrders.length === 0 ? (
                  <div className="text-center py-14 text-neutral-400 text-[11px] border border-dashed border-neutral-300/80 rounded-2xl bg-white/40">
                    Sin pedidos en esta etapa
                  </div>
                ) : (
                  colOrders.map(order => {
                    const stageIdx = getStageIndex(order.status);

                    return (
                      <div 
                        key={order.id}
                        className="rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group border border-neutral-200/60"
                      >
                        {/* VIBRANT COLORED TICKET HEADER */}
                        <div className={`${col.headerBg} ${col.headerTextColor} px-4 py-2.5 flex justify-between items-center font-semibold text-xs`}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold tracking-wider text-xs">
                              {order.order_ref}
                            </span>
                            <button 
                              onClick={() => onEditOrder(order)}
                              className="p-1 hover:bg-black/10 rounded-full transition-colors"
                              title="Editar Pedido completo"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-[10px] font-mono opacity-90 font-medium">
                            {order.created_at}
                          </span>
                        </div>

                        {/* PURE WHITE TICKET BODY */}
                        <div className="bg-white p-4 space-y-3.5">
                          
                          {/* Subtitle & Customer Tag */}
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Cliente Registrado</p>
                              <p className="font-extrabold text-neutral-900 text-xs">{order.customer_name}</p>
                            </div>

                            {order.customer_tag && (
                              <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider border shadow-2xs flex items-center gap-1 ${
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

                          {/* Ordered Products Thumbnails */}
                          {order.items && order.items.length > 0 && (
                            <div className="space-y-1.5 bg-neutral-50/90 p-2.5 rounded-2xl border border-neutral-100">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px]">
                                  <img src={item.image} alt={item.name} className="w-8 h-9 object-cover rounded-xl border bg-white shrink-0 shadow-2xs" />
                                  <div className="truncate">
                                    <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                                    <p className="text-neutral-500 font-mono text-[9.5px]">
                                      {item.quantity} u. • {formatPrice(item.price)} {item.color ? `(${item.color})` : ''}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* HORIZONTAL LOGISTICS TIMELINE STEPPER */}
                          <div className="bg-neutral-50/80 p-3 rounded-2xl border border-neutral-100 space-y-2">
                            <span className="text-[9.5px] uppercase font-bold text-neutral-400 tracking-wider block">Estado de Seguimiento</span>
                            
                            {/* Stepper Bar */}
                            <div className="relative flex items-center justify-between px-2 pt-1 pb-2">
                              {/* Connector Line */}
                              <div className="absolute top-3 left-4 right-4 h-0.5 bg-neutral-200 -z-0"></div>
                              <div 
                                className="absolute top-3 left-4 h-0.5 bg-neutral-900 transition-all duration-500 -z-0"
                                style={{ width: `${(stageIdx / 3) * 100}%` }}
                              ></div>

                              {/* Stepper Node 1: Recibido */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  stageIdx >= 0 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
                                }`}>
                                  <Check className="w-3 h-3" />
                                </div>
                                <span className="text-[8.5px] font-semibold text-neutral-600 mt-1">Recibido</span>
                              </div>

                              {/* Stepper Node 2: En Taller */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  stageIdx >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
                                }`}>
                                  {stageIdx >= 1 ? <Check className="w-3 h-3" /> : '2'}
                                </div>
                                <span className="text-[8.5px] font-semibold text-neutral-600 mt-1">Taller</span>
                              </div>

                              {/* Stepper Node 3: En Tránsito */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  stageIdx >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
                                }`}>
                                  {stageIdx >= 2 ? <Check className="w-3 h-3" /> : '3'}
                                </div>
                                <span className="text-[8.5px] font-semibold text-neutral-600 mt-1">Tránsito</span>
                              </div>

                              {/* Stepper Node 4: Entregado */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  stageIdx >= 3 ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-500'
                                }`}>
                                  {stageIdx >= 3 ? <Check className="w-3 h-3" /> : '4'}
                                </div>
                                <span className="text-[8.5px] font-semibold text-neutral-600 mt-1">Entregado</span>
                              </div>
                            </div>
                          </div>

                          {/* DELIVERY DETAILS BOX */}
                          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/70 space-y-1.5 text-[10px]">
                            <div className="flex justify-between items-center border-b border-neutral-200/50 pb-1">
                              <span className="text-neutral-400 font-bold uppercase text-[9px] flex items-center gap-1">
                                <Truck className="w-3 h-3 text-neutral-700" /> Logística & Despacho
                              </span>
                              <button 
                                onClick={() => openEditLogistics(order)}
                                className="text-[9px] font-bold text-neutral-700 underline hover:text-black flex items-center gap-1"
                              >
                                Asignar Guía <Edit3 className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <div className="space-y-1 text-neutral-800">
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Teléfono:</span>
                                <span className="font-mono font-bold">{order.customer_phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Dirección:</span>
                                <span className="font-semibold text-right max-w-[140px] truncate">{order.shipping_address || 'Showroom'}, {order.city || 'Colombia'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Transportadora:</span>
                                <span className="font-bold text-neutral-900">{order.carrier || 'No asignada'} {order.tracking_number ? `(#${order.tracking_number})` : ''}</span>
                              </div>
                              {order.notes && (
                                <div className="mt-1.5 p-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[9px] flex items-center gap-1 font-semibold">
                                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span className="truncate">{order.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* CARD FOOTER: LARGE PRICE & PILL ACTION BUTTONS (IMAGE 2 DESIGN) */}
                          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                            <div className="flex justify-between items-end">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">Total Pagado</span>
                                <span className="font-mono font-extrabold text-sm text-neutral-900">{formatPrice(order.total)}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {getPrevStatus(order.status) && (
                                  <button
                                    onClick={() => handleMoveStatus(order.id, getPrevStatus(order.status)!)}
                                    className="p-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-full transition-all"
                                    title="Regresar etapa anterior"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}

                                {getNextStatus(order.status) && (
                                  <button
                                    onClick={() => handleMoveStatus(order.id, getNextStatus(order.status)!)}
                                    className="py-1.5 px-3.5 bg-neutral-900 hover:bg-black text-white text-[10px] font-bold rounded-full transition-all flex items-center gap-1 shadow-xs"
                                  >
                                    Avanzar <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* OFFICIAL WHATSAPP TRACKING PILL BUTTON */}
                            <a 
                              href={getWhatsAppLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 bg-[#25D366] hover:bg-[#1EBE57] active:scale-98 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 rounded-full shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                            >
                              <WhatsAppIcon className="w-4 h-4 fill-white" />
                              <span>Enviar Tracking por WhatsApp</span>
                            </a>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* EDIT LOGISTICS MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-2xl max-w-md w-full p-6 border border-white/80 rounded-[28px] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-900" /> Logística — {editingOrder.order_ref}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLogistics} className="space-y-3">
              <div>
                <label className="block uppercase font-bold text-neutral-500 text-[10px] mb-1">Empresa Transportadora</label>
                <select 
                  value={editCarrier}
                  onChange={(e) => setEditCarrier(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-2.5 font-bold focus:outline-none focus:border-neutral-900 text-xs"
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
                  required
                  placeholder="Ej. 9812739182"
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-2.5 font-mono font-bold text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button 
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-full text-xs uppercase font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-neutral-900 text-white rounded-full text-xs uppercase font-bold hover:bg-black flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4 text-amber-300" /> Guardar Guía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
