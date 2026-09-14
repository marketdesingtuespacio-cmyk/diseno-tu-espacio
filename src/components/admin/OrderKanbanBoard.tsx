import React, { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Edit, 
  Check, 
  X
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

const KANBAN_COLUMNS: { id: Order['status']; title: string; icon: string; badgeColor: string; accentColor: string }[] = [
  { id: 'pending', title: 'Pendientes por Verificar', icon: '🕒', badgeColor: 'bg-amber-100/80 text-amber-900 border-amber-300', accentColor: 'from-amber-400 to-amber-500' },
  { id: 'processing', title: 'En Preparación / Taller', icon: '📦', badgeColor: 'bg-blue-100/80 text-blue-900 border-blue-300', accentColor: 'from-blue-400 to-blue-500' },
  { id: 'shipped', title: 'Despachados / En Tránsito', icon: '🚚', badgeColor: 'bg-purple-100/80 text-purple-900 border-purple-300', accentColor: 'from-purple-400 to-purple-500' },
  { id: 'delivered', title: 'Entregados / Posventa', icon: '✅', badgeColor: 'bg-emerald-100/80 text-emerald-900 border-emerald-300', accentColor: 'from-emerald-400 to-emerald-500' },
  { id: 'cancelled', title: 'Cancelados', icon: '❌', badgeColor: 'bg-neutral-100 text-neutral-600 border-neutral-300', accentColor: 'from-neutral-300 to-neutral-400' }
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
    if (order.status === 'shipped') statusText = 'Despachado en Tránsito 🚚';
    if (order.status === 'delivered') statusText = 'Entregado con Éxito ✅';
    if (order.status === 'cancelled') statusText = 'Cancelado';

    const text = `Hola *${order.customer_name}*, te saludamos de *Diseño Tu Espacio - By Alexis Madrigal*. 👋✨\n\nTe informamos que tu pedido *Ref: ${order.order_ref}* se encuentra en el estado: *${statusText}*.\n\n📦 *Detalles de Logística & Envíos:*\n• Transportadora: ${order.carrier || 'Flete Privado'}\n• Número de Guía: ${order.tracking_number || 'En asignación'}\n• Ciudad Destino: ${order.city || 'Colombia'}\n\nPuedes realizar cualquier consulta posventa respondiendo a este mensaje.\n¡Gracias por elegir diseño de autor!`;

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

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Kanban Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {KANBAN_COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          const colTotalCOP = colOrders.reduce((acc, o) => acc + o.total, 0);

          return (
            <div 
              key={col.id} 
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl flex flex-col min-h-[520px] shadow-sm overflow-hidden"
            >
              
              {/* Column Top Accent & Header */}
              <div className="relative">
                <div className={`h-1.5 w-full bg-gradient-to-r ${col.accentColor}`}></div>
                <div className="p-3.5 border-b border-neutral-200/50 bg-white/70 backdrop-blur-md flex justify-between items-center">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-brand-black text-[11px] flex items-center gap-1.5">
                      <span>{col.icon}</span> {col.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5 font-medium">
                      {formatPrice(colTotalCOP)}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full border shadow-xs ${col.badgeColor}`}>
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Column Body: Glass Cards Container */}
              <div className="p-2.5 space-y-3 flex-1 overflow-y-auto max-h-[750px]">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 text-[11px] border border-dashed border-neutral-300/80 rounded-xl bg-white/30">
                    Sin pedidos en esta etapa
                  </div>
                ) : (
                  colOrders.map(order => (
                    <div 
                      key={order.id}
                      className="bg-white/90 backdrop-blur-md border border-neutral-200/70 rounded-xl p-3.5 space-y-3 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      {/* Card Header: Order Ref, Edit Button & Tag */}
                      <div className="flex justify-between items-start border-b border-neutral-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-brand-black text-xs block tracking-tight">
                              {order.order_ref}
                            </span>
                            <button
                              onClick={() => onEditOrder(order)}
                              className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition-colors"
                              title="Editar Pedido completo (dirección, cliente, ítems)"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[9px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                            <Calendar className="w-2.5 h-2.5 text-neutral-400" /> {order.created_at}
                          </span>
                        </div>

                        {order.customer_tag && (
                          <span className={`px-2 py-0.5 text-[9px] font-bold border rounded-full uppercase tracking-wider shadow-xs ${
                            order.customer_tag === 'VIP' ? 'bg-amber-100/90 text-amber-950 border-amber-300' :
                            order.customer_tag === 'Arquitecto' ? 'bg-indigo-100/90 text-indigo-950 border-indigo-300' :
                            'bg-emerald-100/90 text-emerald-950 border-emerald-300'
                          }`}>
                            {order.customer_tag === 'VIP' && '👑 VIP'}
                            {order.customer_tag === 'Arquitecto' && '📐 Arq'}
                            {order.customer_tag === 'Residencial' && '🏡 Res'}
                            {order.customer_tag === 'Proyecto Especial' && '🏢 Contract'}
                          </span>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-0.5">
                        <p className="font-bold text-brand-black text-xs">{order.customer_name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">{order.customer_phone}</p>
                        {order.city && (
                          <p className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                            <span>📍</span> {order.city} {order.shipping_address ? `• ${order.shipping_address}` : ''}
                          </p>
                        )}
                      </div>

                      {/* Item Visual Thumbnails */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-1.5 bg-neutral-50/80 p-2 rounded-lg border border-neutral-200/60">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px]">
                              <img src={item.image} alt={item.name} className="w-8 h-9 object-cover rounded border bg-white shrink-0 shadow-xs" />
                              <div className="truncate">
                                <p className="font-bold text-brand-black truncate">{item.name}</p>
                                <p className="text-neutral-500 font-mono">
                                  {item.quantity} u. • {formatPrice(item.price)} {item.color ? `(${item.color})` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Logistics Info (Carrier & Tracking) */}
                      <div className="bg-white p-2 rounded-lg border border-neutral-200/80 flex justify-between items-center text-[10px] shadow-2xs">
                        <div>
                          <span className="text-neutral-400 block text-[9px] uppercase font-bold tracking-wider">Transportadora / Guía</span>
                          <span className="font-bold text-brand-black">
                            {order.carrier || 'No asignada'} {order.tracking_number ? `(#${order.tracking_number})` : ''}
                          </span>
                        </div>
                        <button 
                          onClick={() => openEditLogistics(order)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 rounded-md transition-colors"
                          title="Editar Logística y Número de Guía"
                        >
                          <Edit className="w-3.5 h-3.5 text-neutral-700" />
                        </button>
                      </div>

                      {/* Financial Total */}
                      <div className="flex justify-between items-center pt-1 border-t border-neutral-100">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Pagado:</span>
                        <span className="font-mono font-bold text-xs text-brand-black">{formatPrice(order.total)}</span>
                      </div>

                      {/* Card Action Buttons: Move Stage & WhatsApp */}
                      <div className="space-y-2 pt-2 border-t border-neutral-100">
                        <div className="grid grid-cols-2 gap-1.5">
                          {getPrevStatus(order.status) ? (
                            <button
                              onClick={() => handleMoveStatus(order.id, getPrevStatus(order.status)!)}
                              className="py-1.5 px-2 border border-neutral-300 text-neutral-700 text-[9px] font-bold uppercase hover:bg-neutral-100 rounded-lg flex items-center justify-center gap-1 transition-all"
                              title="Devolver etapa"
                            >
                              <ArrowLeft className="w-3 h-3" /> Regresar
                            </button>
                          ) : (
                            <div></div>
                          )}

                          {getNextStatus(order.status) && (
                            <button
                              onClick={() => handleMoveStatus(order.id, getNextStatus(order.status)!)}
                              className="py-1.5 px-2 bg-brand-black text-white text-[9px] font-bold uppercase hover:bg-neutral-800 rounded-lg flex items-center justify-center gap-1 col-start-2 shadow-xs transition-all"
                              title="Avanzar etapa"
                            >
                              Avanzar <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* OFFICIAL WHATSAPP TRACKING NOTIFICATION BUTTON */}
                        <a 
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-[#25D366] hover:bg-[#1EBE57] active:scale-98 text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 rounded-lg shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                          <span>Enviar Tracking por WhatsApp</span>
                        </a>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* EDIT LOGISTICS MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-2xl max-w-md w-full p-6 border border-white/80 rounded-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-brand-black text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-black" /> Logística — {editingOrder.order_ref}
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
                  className="w-full bg-brand-surface border border-neutral-200 rounded-lg p-2.5 font-bold focus:outline-none focus:border-brand-black text-xs"
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
                  className="w-full bg-brand-surface border border-neutral-200 rounded-lg p-2.5 font-mono font-bold text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button 
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-xs uppercase font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-black text-white rounded-lg text-xs uppercase font-bold hover:bg-neutral-800 flex items-center gap-1.5 shadow-sm"
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
