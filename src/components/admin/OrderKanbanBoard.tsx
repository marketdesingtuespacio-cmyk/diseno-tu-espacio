import React, { useState } from 'react';
import { 
  Truck, 
  MessageSquare, 
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

interface OrderKanbanBoardProps {
  orders: Order[];
  onOrderUpdated: () => void;
}

const KANBAN_COLUMNS: { id: Order['status']; title: string; icon: string; color: string; borderTop: string }[] = [
  { id: 'pending', title: 'Pendientes por Verificar', icon: '🕒', color: 'bg-amber-50 text-amber-900', borderTop: 'border-t-amber-500' },
  { id: 'processing', title: 'En Preparación / Taller', icon: '📦', color: 'bg-blue-50 text-blue-900', borderTop: 'border-t-blue-500' },
  { id: 'shipped', title: 'Despachados / En Tránsito', icon: '🚚', color: 'bg-purple-50 text-purple-900', borderTop: 'border-t-purple-500' },
  { id: 'delivered', title: 'Entregados / Posventa', icon: '✅', color: 'bg-emerald-50 text-emerald-900', borderTop: 'border-t-emerald-500' },
  { id: 'cancelled', title: 'Cancelados', icon: '❌', color: 'bg-neutral-100 text-neutral-600', borderTop: 'border-t-neutral-400' }
];

export const OrderKanbanBoard: React.FC<OrderKanbanBoardProps> = ({ orders, onOrderUpdated }) => {
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
    
    let statusText = 'Pendiente';
    if (order.status === 'processing') statusText = 'En Preparación';
    if (order.status === 'shipped') statusText = 'Despachado en Tránsito 🚚';
    if (order.status === 'delivered') statusText = 'Entregado con Éxito ✅';
    if (order.status === 'cancelled') statusText = 'Cancelado';

    const text = `Hola *${order.customer_name}*, te saludamos de *Diseño Tu Espacio - By Alexis Madrigal*. 👋✨\n\nTe informamos que tu pedido *Ref: ${order.order_ref}* se encuentra en estado: *${statusText}*.\n\n📦 *Detalles de Logística:*\n• Transportadora: ${order.carrier || 'Flete Privado'}\n• Número de Guía: ${order.tracking_number || 'En asignación'}\n• Ciudad: ${order.city || 'Colombia'}\n\nPuedes consultar el estado posventa directamente con nuestro equipo de atención.\n¡Muchas gracias por elegir diseño de autor!`;

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          const colTotalCOP = colOrders.reduce((acc, o) => acc + o.total, 0);

          return (
            <div key={col.id} className="bg-brand-surface border border-brand-border flex flex-col min-h-[500px]">
              
              {/* Column Header */}
              <div className={`p-3 border-b border-brand-border border-t-4 ${col.borderTop} bg-white flex justify-between items-center`}>
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-brand-black text-[11px] flex items-center gap-1.5">
                    <span>{col.icon}</span> {col.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {formatPrice(colTotalCOP)}
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-none ${col.color}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Column Body: Cards Container */}
              <div className="p-2 space-y-3 flex-1 overflow-y-auto max-h-[750px]">
                {colOrders.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400 text-[11px] border border-dashed border-neutral-300">
                    Sin pedidos en esta etapa
                  </div>
                ) : (
                  colOrders.map(order => (
                    <div 
                      key={order.id}
                      className="bg-white border border-brand-border p-3 space-y-3 shadow-subtle hover:border-brand-black transition-all group"
                    >
                      {/* Card Header: Order Ref & Tag */}
                      <div className="flex justify-between items-start border-b border-brand-border pb-2">
                        <div>
                          <span className="font-mono font-bold text-brand-black text-xs block">
                            {order.order_ref}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> {order.created_at}
                          </span>
                        </div>

                        {order.customer_tag && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                            order.customer_tag === 'VIP' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            order.customer_tag === 'Arquitecto' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' :
                            'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {order.customer_tag === 'VIP' && '👑 VIP'}
                            {order.customer_tag === 'Arquitecto' && '📐 Arq'}
                            {order.customer_tag === 'Residencial' && '🏡 Res'}
                            {order.customer_tag === 'Proyecto Especial' && '🏢 Proyect'}
                          </span>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div>
                        <p className="font-bold text-brand-black text-xs">{order.customer_name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">{order.customer_phone}</p>
                        {order.city && (
                          <p className="text-[10px] text-neutral-400 truncate">📍 {order.city}</p>
                        )}
                      </div>

                      {/* Item Visual Thumbnails */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-1.5 bg-brand-surface p-2 border border-brand-border">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px]">
                              <img src={item.image} alt={item.name} className="w-7 h-8 object-cover border bg-white shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-brand-black truncate">{item.name}</p>
                                <p className="text-neutral-500 font-mono">
                                  {item.quantity}x {formatPrice(item.price)} {item.color ? `(${item.color})` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Logistics Info (Carrier & Tracking) */}
                      <div className="bg-neutral-50 p-2 border border-neutral-200 flex justify-between items-center text-[10px]">
                        <div>
                          <span className="text-neutral-400 block text-[9px] uppercase font-bold">Transportadora / Guía</span>
                          <span className="font-bold text-brand-black">
                            {order.carrier || 'No asignada'} {order.tracking_number ? `(#${order.tracking_number})` : ''}
                          </span>
                        </div>
                        <button 
                          onClick={() => openEditLogistics(order)}
                          className="p-1 hover:bg-neutral-200 text-neutral-600 rounded"
                          title="Editar Logística y Número de Guía"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Financial Total */}
                      <div className="flex justify-between items-center pt-1 border-t border-brand-border">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Total Pagado:</span>
                        <span className="font-mono font-bold text-xs text-brand-black">{formatPrice(order.total)}</span>
                      </div>

                      {/* Card Action Buttons: Move Stage & WhatsApp */}
                      <div className="space-y-1.5 pt-2 border-t border-brand-border">
                        <div className="grid grid-cols-2 gap-1.5">
                          {getPrevStatus(order.status) ? (
                            <button
                              onClick={() => handleMoveStatus(order.id, getPrevStatus(order.status)!)}
                              className="py-1 px-2 border border-neutral-300 text-neutral-600 text-[9px] font-bold uppercase hover:bg-neutral-100 flex items-center justify-center gap-1"
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
                              className="py-1 px-2 bg-brand-black text-white text-[9px] font-bold uppercase hover:bg-neutral-800 flex items-center justify-center gap-1 col-start-2"
                              title="Avanzar etapa"
                            >
                              Avanzar <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* WhatsApp Tracking Notification Button */}
                        <a 
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-white" /> Enviar Tracking por WhatsApp
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 border border-brand-black shadow-modal space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-2">
              <h3 className="font-bold uppercase tracking-wider text-brand-black flex items-center gap-2">
                <Truck className="w-4 h-4" /> Logística — {editingOrder.order_ref}
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
                  className="w-full bg-brand-surface border border-brand-border p-2 font-bold"
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
                  className="w-full bg-brand-surface border border-brand-border p-2 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
                <button 
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-brand-border text-xs uppercase font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-black text-white text-xs uppercase font-bold hover:bg-neutral-800 flex items-center gap-1"
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
