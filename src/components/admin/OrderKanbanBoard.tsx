import React, { useState } from 'react';
import { 
  Truck, 
  Edit, 
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  GripVertical,
  Trash2,
  MessageCircle,
  Building2,
  Crown,
  Ruler,
  Home
} from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { orderService } from '../../services/orderService';
import { OrderDetailModal } from './OrderDetailModal';

interface OrderKanbanBoardProps {
  orders: Order[];
  onOrderUpdated: () => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder?: (id: string) => void;
}

// Executive, Sober Corporate Column Definitions
const KANBAN_COLUMNS: { 
  id: Order['status']; 
  title: string; 
  icon: React.ElementType; 
  accentBorder: string;
  badgeClass: string;
}[] = [
  { 
    id: 'pending', 
    title: 'Pendientes por Verificar', 
    icon: Clock, 
    accentBorder: 'border-l-neutral-400',
    badgeClass: 'bg-neutral-200 text-neutral-800'
  },
  { 
    id: 'processing', 
    title: 'En Preparación / Taller', 
    icon: Package, 
    accentBorder: 'border-l-neutral-600',
    badgeClass: 'bg-neutral-300 text-neutral-900'
  },
  { 
    id: 'shipped', 
    title: 'Despachados / En Tránsito', 
    icon: Truck, 
    accentBorder: 'border-l-neutral-800',
    badgeClass: 'bg-neutral-800 text-white'
  },
  { 
    id: 'delivered', 
    title: 'Entregados / Posventa', 
    icon: CheckCircle2, 
    accentBorder: 'border-l-neutral-950',
    badgeClass: 'bg-neutral-950 text-white'
  },
  { 
    id: 'cancelled', 
    title: 'Cancelados', 
    icon: XCircle, 
    accentBorder: 'border-l-neutral-300',
    badgeClass: 'bg-neutral-100 text-neutral-500'
  }
];

export const OrderKanbanBoard: React.FC<OrderKanbanBoardProps> = ({ orders, onOrderUpdated, onEditOrder, onDeleteOrder }) => {
  const { formatPrice } = useCurrency();

  // Detail Modal State (View Only)
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);

  // Drag and Drop States
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<Order['status'] | null>(null);

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedOrderId(orderId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: Order['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: Order['status']) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (!orderId) return;

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder && targetOrder.status !== targetStatus) {
      await orderService.updateOrderStatus(orderId, targetStatus);
      onOrderUpdated();
    }
    setDraggedOrderId(null);
  };

  const handleDragEnd = () => {
    setDraggedOrderId(null);
    setActiveDropColumn(null);
  };

  // Executive Date Formatter
  const formatOrderDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.split('T')[0] || dateStr;
      return new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(d);
    } catch {
      return dateStr.split('T')[0] || dateStr;
    }
  };

  // Generate WhatsApp Message Link
  const getWhatsAppLink = (order: Order) => {
    const rawPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('57') ? rawPhone : `57${rawPhone}`;
    
    let statusText = 'Pendiente por Verificar';
    if (order.status === 'processing') statusText = 'En Preparación / Taller';
    if (order.status === 'shipped') statusText = 'Despachado en Tránsito';
    if (order.status === 'delivered') statusText = 'Entregado con Éxito';
    if (order.status === 'cancelled') statusText = 'Cancelado';

    const text = `Hola *${order.customer_name}*, te saludamos de *Diseño Tu Espacio - By Alexis Madrigal*.\n\nTe informamos que tu pedido *Ref: ${order.order_ref}* se encuentra en el estado: *${statusText}*.\n\n*Detalles de Logística & Envíos:*\n• Transportadora: ${order.carrier || 'Flete Privado'}\n• Número de Guía: ${order.tracking_number || 'En asignación'}\n• Ciudad Destino: ${order.city || 'Colombia'}\n\nPuedes realizar cualquier consulta posventa respondiendo a este mensaje.\n¡Gracias por elegir diseño de autor!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Customer Tag
  const renderCustomerTag = (order: Order) => {
    if (!order.customer_tag && !order.pricing_mode) return null;
    const isMayorista = order.customer_tag === 'Mayorista' || order.pricing_mode === 'mayorista';
    const tag = isMayorista ? 'Mayorista' : order.customer_tag;

    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-semibold tracking-wider uppercase bg-neutral-100 text-neutral-700 border border-neutral-300 shrink-0">
        {isMayorista && <Building2 className="w-2.5 h-2.5 text-neutral-600" />}
        {tag === 'VIP' && <Crown className="w-2.5 h-2.5 text-neutral-600" />}
        {tag === 'Arquitecto' && <Ruler className="w-2.5 h-2.5 text-neutral-600" />}
        {tag === 'Residencial' && <Home className="w-2.5 h-2.5 text-neutral-600" />}
        <span>{isMayorista ? 'Mayorista' : tag === 'VIP' ? 'VIP' : tag === 'Arquitecto' ? 'Arq' : tag === 'Residencial' ? 'Res' : tag}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Kanban Grid Columns */}
      <div className="flex lg:grid lg:grid-cols-5 gap-3.5 overflow-x-auto pb-6 snap-x snap-mandatory lg:snap-none -mx-1 px-1">
        {KANBAN_COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          const colTotalCOP = colOrders.reduce((acc, o) => acc + o.total, 0);

          const ColIcon = col.icon;
          const isDropActive = activeDropColumn === col.id;

          return (
            <div 
              key={col.id} 
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-neutral-100/70 rounded-2xl flex flex-col min-h-[500px] w-[86vw] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start shadow-xs p-2.5 transition-all duration-200 ${
                isDropActive 
                  ? 'border-2 border-neutral-900 bg-neutral-200 ring-4 ring-black/5 scale-[1.01]' 
                  : 'border border-neutral-200'
              }`}
            >
              
              {/* Sober Column Header */}
              <div className="bg-white rounded-xl p-3 border border-neutral-200/90 shadow-2xs flex justify-between items-center mb-2.5">
                <div>
                  <h4 className="font-bold text-neutral-900 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                    <ColIcon className="w-3.5 h-3.5 shrink-0 text-neutral-600" /> {col.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono font-medium mt-0.5">
                    {formatPrice(colTotalCOP)}
                  </p>
                </div>
                <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold ${col.badgeClass}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Column Body: Drag & Drop Cards */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[780px] px-0.5">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 text-[10.5px] border border-dashed border-neutral-300 rounded-xl bg-white/40 font-medium">
                    Sin pedidos en esta etapa
                  </div>
                ) : (
                  colOrders.map(order => {
                    const isDragged = draggedOrderId === order.id;

                    return (
                      <div 
                        key={order.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, order.id)}
                        onDragEnd={handleDragEnd}
                        className={`group rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 border border-neutral-200 bg-white cursor-grab active:cursor-grabbing select-none border-l-4 ${col.accentBorder} ${
                          isDragged ? 'opacity-30 scale-95 border-dashed border-neutral-800' : ''
                        }`}
                      >
                        {/* CORPORATE TICKET HEADER */}
                        <div className="px-3 pt-2.5 pb-2 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/60">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-700">
                              <GripVertical className="w-3 h-3" />
                            </span>
                            <span className="font-mono font-bold tracking-tight text-neutral-950 text-[11px] bg-white px-1.5 py-0.5 rounded border border-neutral-200 shadow-2xs">
                              {order.order_ref}
                            </span>
                            <span className="text-[9.5px] text-neutral-500 font-medium truncate">
                              {formatOrderDate(order.created_at)}
                            </span>
                          </div>

                          {/* Action Icon Buttons */}
                          <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedDetailOrder(order); }}
                              className="p-1 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                              title="Ver detalle del pedido"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); onEditOrder(order); }}
                              className="p-1 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                              title="Editar pedido completo"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {onDeleteOrder && (
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if (confirm(`¿Está seguro de eliminar el pedido ${order.order_ref}?`)) {
                                    onDeleteOrder(order.id);
                                  }
                                }}
                                className="p-1 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar pedido permanentemente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* CARD BODY */}
                        <div 
                          onClick={() => setSelectedDetailOrder(order)}
                          className="p-3 space-y-2.5 hover:bg-neutral-50/40 transition-colors cursor-pointer"
                        >
                          
                          {/* Customer Name & CRM Tag */}
                          <div className="flex justify-between items-start gap-1.5">
                            <div className="min-w-0 flex-1">
                              <p className="text-[8.5px] uppercase font-bold text-neutral-400 tracking-wider">Cliente</p>
                              <p className="font-bold text-neutral-950 text-xs truncate leading-tight mt-0.5">
                                {order.customer_name}
                              </p>
                              {order.city && (
                                <p className="text-[9.5px] text-neutral-500 truncate mt-0.5">
                                  {order.city}
                                </p>
                              )}
                            </div>

                            {renderCustomerTag(order)}
                          </div>

                          {/* Product Summary */}
                          {order.items && order.items.length > 0 && (
                            <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-200/70 flex items-center gap-2 text-[10px]">
                              <img 
                                src={order.items[0].image} 
                                alt={order.items[0].name} 
                                className="w-7 h-7 object-cover rounded border border-neutral-200 bg-white shrink-0 shadow-2xs" 
                              />
                              <div className="truncate flex-1 min-w-0">
                                <p className="font-semibold text-neutral-900 truncate text-[10.5px]">{order.items[0].name}</p>
                                <p className="text-neutral-500 text-[9px] font-mono">
                                  {order.items[0].quantity} u. • {formatPrice(order.items[0].price)}
                                </p>
                              </div>
                              {order.items.length > 1 && (
                                <span className="text-[8.5px] font-bold bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-full shrink-0">
                                  +{order.items.length - 1} más
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price & Payment Abono Status */}
                          <div className="flex justify-between items-baseline pt-1">
                            <div>
                              <span className="text-[8.5px] uppercase font-bold text-neutral-400 tracking-wider block">Total</span>
                              <span className="font-extrabold text-xs text-neutral-950 tracking-tight">
                                {formatPrice(order.total)}
                              </span>
                            </div>

                            <div>
                              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[8.5px] uppercase border ${
                                (order.deposit_amount || 0) >= order.total && order.total > 0
                                  ? 'bg-neutral-900 text-white border-neutral-900'
                                  : (order.deposit_amount || 0) > 0
                                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                                  : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                              }`}>
                                {(order.deposit_amount || 0) >= order.total && order.total > 0
                                  ? '✓ Pagado 100%'
                                  : (order.deposit_amount || 0) > 0
                                  ? `Abono: ${formatPrice(order.deposit_amount || 0)}`
                                  : 'Sin Abono'}
                              </span>
                            </div>
                          </div>

                          {/* ACTION FOOTER */}
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex-1 min-w-0">
                              <select
                                value={order.status}
                                onChange={async (e) => {
                                  e.stopPropagation();
                                  await orderService.updateOrderStatus(order.id, e.target.value as any);
                                  onOrderUpdated();
                                }}
                                className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg px-2 py-1 text-[9.5px] font-medium text-neutral-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-colors"
                              >
                                <option value="pending">Pendiente por Verificar</option>
                                <option value="processing">En Preparación / Taller</option>
                                <option value="shipped">Despachado en Tránsito</option>
                                <option value="delivered">Entregado / Posventa</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                            </div>

                            <a 
                              href={getWhatsAppLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-all shrink-0 active:scale-95 shadow-2xs"
                              title="Notificar estado por WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 text-neutral-300" />
                              <span className="whitespace-nowrap">Notificar</span>
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

      {/* FULL DETAIL VIEW MODAL */}
      {selectedDetailOrder && (
        <OrderDetailModal
          isOpen={!!selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
          order={selectedDetailOrder}
          onEditOrder={(ord) => onEditOrder(ord)}
          onDeleteOrder={onDeleteOrder}
        />
      )}

    </div>
  );
};
