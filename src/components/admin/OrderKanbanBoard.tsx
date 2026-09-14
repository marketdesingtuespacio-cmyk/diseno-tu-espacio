import React, { useState } from 'react';
import { 
  Truck, 
  Edit, 
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Crown,
  Ruler,
  Home,
  Building2,
  Eye,
  GripVertical
} from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { orderService } from '../../services/orderService';
import { OrderDetailModal } from './OrderDetailModal';

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

// Columns definition with Vibrant Header Ticket Colors
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
    headerBg: 'bg-[#E5FF53]', 
    headerTextColor: 'text-neutral-950',
    pillBg: 'bg-yellow-100 text-yellow-900 border-yellow-300' 
  },
  { 
    id: 'processing', 
    title: 'En Preparación / Taller', 
    icon: Package, 
    headerBg: 'bg-[#5B75FF]', 
    headerTextColor: 'text-white',
    pillBg: 'bg-blue-100 text-blue-900 border-blue-300' 
  },
  { 
    id: 'shipped', 
    title: 'Despachados / En Tránsito', 
    icon: Truck, 
    headerBg: 'bg-[#6EE7B7]', 
    headerTextColor: 'text-neutral-950',
    pillBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' 
  },
  { 
    id: 'delivered', 
    title: 'Entregados / Posventa', 
    icon: CheckCircle2, 
    headerBg: 'bg-[#F472B6]', 
    headerTextColor: 'text-white',
    pillBg: 'bg-pink-100 text-pink-900 border-pink-300' 
  },
  { 
    id: 'cancelled', 
    title: 'Cancelados', 
    icon: XCircle, 
    headerBg: 'bg-[#9CA3AF]', 
    headerTextColor: 'text-white',
    pillBg: 'bg-neutral-200 text-neutral-800 border-neutral-300' 
  }
];

export const OrderKanbanBoard: React.FC<OrderKanbanBoardProps> = ({ orders, onOrderUpdated, onEditOrder }) => {
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

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Kanban Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-6">
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
              className={`bg-[#F3F3F5] rounded-[24px] flex flex-col min-h-[500px] shadow-2xs overflow-hidden p-2 transition-all duration-200 ${
                isDropActive ? 'border-2 border-neutral-900 bg-neutral-200/90 ring-4 ring-black/5 scale-[1.01]' : 'border border-white/80'
              }`}
            >
              
              {/* Column Header Card */}
              <div className="bg-white rounded-2xl p-3 border border-neutral-200/60 shadow-2xs flex justify-between items-center mb-2.5">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-neutral-900 text-[10.5px] flex items-center gap-1.5">
                    <ColIcon className="w-3.5 h-3.5 shrink-0 text-neutral-700" /> {col.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 font-medium">
                    {formatPrice(colTotalCOP)}
                  </p>
                </div>
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-neutral-900 text-white font-mono text-[9.5px] font-bold shadow-xs">
                  {colOrders.length}
                </span>
              </div>

              {/* Column Body: Compact Drag & Drop Cards Container */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[780px] px-0.5">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 text-[10.5px] border border-dashed border-neutral-300/80 rounded-2xl bg-white/40 font-medium">
                    Arrastra un pedido aquí
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
                        className={`rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 border border-neutral-200/80 bg-white cursor-grab active:cursor-grabbing select-none ${
                          isDragged ? 'opacity-30 scale-95 border-dashed border-black' : ''
                        }`}
                      >
                        {/* COMPACT COLORED TICKET HEADER */}
                        <div className={`${col.headerBg} ${col.headerTextColor} px-3.5 py-1.5 flex justify-between items-center font-semibold text-xs`}>
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="w-3 h-3 opacity-60" />
                            <span className="font-mono font-extrabold tracking-wider text-[11px]">
                              {order.order_ref}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9.5px] font-mono opacity-90 font-medium">
                              {order.created_at}
                            </span>
                            
                            <div className="flex items-center gap-0.5">
                              {/* View Details Eye Icon Button */}
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedDetailOrder(order); }}
                                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                                title="Ver detalle completo"
                              >
                                <Eye className="w-3 h-3" />
                              </button>

                              {/* Edit Order Pencil Icon Button */}
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEditOrder(order); }}
                                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                                title="Editar pedido completo"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* COMPACT CARD BODY - Clickable to open Detail Modal */}
                        <div 
                          onClick={() => setSelectedDetailOrder(order)}
                          className="p-3 space-y-2.5 hover:bg-neutral-50/50 transition-colors cursor-pointer"
                        >
                          
                          {/* Customer Name & CRM Tag */}
                          <div className="flex justify-between items-center gap-1.5">
                            <div className="truncate">
                              <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Cliente</p>
                              <p className="font-extrabold text-neutral-900 text-xs truncate max-w-[125px]">
                                {order.customer_name}
                              </p>
                            </div>

                            {order.customer_tag && (
                              <span className={`px-2 py-0.5 text-[8.5px] font-extrabold rounded-full uppercase tracking-wider border shrink-0 flex items-center gap-1 ${
                                order.customer_tag === 'VIP' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                                order.customer_tag === 'Arquitecto' ? 'bg-indigo-100 text-indigo-950 border-indigo-300' :
                                order.customer_tag === 'Residencial' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                                'bg-purple-100 text-purple-950 border-purple-300'
                              }`}>
                                {order.customer_tag === 'VIP' && <Crown className="w-2 h-2 text-amber-600" />}
                                {order.customer_tag === 'Arquitecto' && <Ruler className="w-2 h-2 text-indigo-600" />}
                                {order.customer_tag === 'Residencial' && <Home className="w-2 h-2 text-emerald-600" />}
                                {order.customer_tag === 'Proyecto Especial' && <Building2 className="w-2 h-2 text-purple-600" />}
                                {order.customer_tag === 'VIP' ? 'VIP' : order.customer_tag === 'Arquitecto' ? 'Arq' : order.customer_tag === 'Residencial' ? 'Res' : 'Contract'}
                              </span>
                            )}
                          </div>

                          {/* Minimum 1 product purchased info card */}
                          {order.items && order.items.length > 0 && (
                            <div className="bg-neutral-50/90 p-2 rounded-xl border border-neutral-100 flex items-center gap-2 text-[10px]">
                              <img 
                                src={order.items[0].image} 
                                alt={order.items[0].name} 
                                className="w-8 h-9 object-cover rounded-lg border bg-white shrink-0 shadow-2xs" 
                              />
                              <div className="truncate flex-1">
                                <p className="font-bold text-neutral-900 truncate">{order.items[0].name}</p>
                                <p className="text-neutral-500 font-mono text-[9px]">
                                  {order.items[0].quantity} u. • {formatPrice(order.items[0].price)}
                                </p>
                              </div>
                              {order.items.length > 1 && (
                                <span className="text-[8.5px] font-extrabold bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-full shrink-0">
                                  +{order.items.length - 1} más
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price & Lowercase WhatsApp Tracking Pill Button */}
                          <div className="flex justify-between items-center pt-1.5 border-t border-neutral-100">
                            <div>
                              <span className="text-[8.5px] uppercase font-bold text-neutral-400 block tracking-wider">Total</span>
                              <span className="font-mono font-extrabold text-xs text-neutral-900">
                                {formatPrice(order.total)}
                              </span>
                            </div>

                            <a 
                              href={getWhatsAppLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-1 px-2.5 bg-[#25D366] hover:bg-[#1EBE57] active:scale-95 text-white font-extrabold text-[9.5px] lowercase tracking-wide flex items-center gap-1.5 rounded-full shadow-2xs transition-all cursor-pointer"
                              title="Enviar actualización por WhatsApp"
                            >
                              <WhatsAppIcon className="w-3 h-3 fill-white shrink-0" />
                              <span>enviar tracking por whatsapp</span>
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
        />
      )}

    </div>
  );
};
