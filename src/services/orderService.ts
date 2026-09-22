import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';
import { productService } from './productService';
import { activityLogService } from './activityLogService';

const LOCAL_STORAGE_ORDERS_KEY = 'luxe_orders_cache_v2';

let isOrderRealtimeSubscribed = false;

export const notifyOrdersUpdated = () => {
  window.dispatchEvent(new Event('orders_updated'));
};

export const subscribeToOrders = (callback: () => void): (() => void) => {
  const handleEvent = () => callback();
  window.addEventListener('orders_updated', handleEvent);

  if (isSupabaseConfigured() && !isOrderRealtimeSubscribed) {
    isOrderRealtimeSubscribed = true;
    try {
      supabase
        .channel('public_orders_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          window.dispatchEvent(new Event('orders_updated'));
        })
        .subscribe();
    } catch (err) {
      console.warn('Supabase Realtime subscription warning for orders:', err);
    }
  }

  return () => {
    window.removeEventListener('orders_updated', handleEvent);
  };
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_ref: 'DT-918234',
    customer_name: 'Valentina Restrepo',
    customer_email: 'valentina.r@ejemplo.com',
    customer_phone: '+57 315 678 9012',
    customer_tag: 'VIP',
    shipping_address: 'Calle 10A # 34-12, El Poblado',
    city: 'Medellín',
    carrier: 'Servientrega',
    tracking_number: '9102837412',
    subtotal: 3200000,
    shipping_cost: 100000,
    discount: 0,
    total: 3300000,
    status: 'processing',
    payment_method: 'Tarjeta de Crédito',
    payment_gateway: 'Wompi Colombia',
    items_count: 2,
    items: [
      {
        product_id: 'prod-1',
        name: 'Lámpara de Pie Escultórica Monolito',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        price: 1800000,
        quantity: 1,
        color: 'Latón Cepillado'
      },
      {
        product_id: 'prod-2',
        name: 'Aplique de Pared Geometría Minimal',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
        price: 1500000,
        quantity: 1,
        color: 'Negro Mate'
      }
    ],
    notes: 'Cliente requiere entrega urgente en portería antes de las 5 PM.',
    created_at: '2026-08-22 14:30'
  },
  {
    id: 'ord-2',
    order_ref: 'DT-847291',
    customer_name: 'Santiago Jaramillo',
    customer_email: 'santiago.j@ejemplo.com',
    customer_phone: '+57 301 234 5678',
    customer_tag: 'Arquitecto',
    shipping_address: 'Carrera 43A # 1-50, San Fernando',
    city: 'Cali',
    carrier: 'Interrapidísimo',
    tracking_number: '200481923',
    subtotal: 850000,
    shipping_cost: 40000,
    discount: 0,
    total: 890000,
    status: 'shipped',
    payment_method: 'PSE Débito Bancario',
    payment_gateway: 'Wompi Colombia',
    items_count: 1,
    items: [
      {
        product_id: 'prod-3',
        name: 'Lámpara Colgante Cúpula Industrial',
        image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800',
        price: 850000,
        quantity: 1,
        color: 'Cobre Pulido'
      }
    ],
    notes: 'Proyecto residencial en Pance.',
    created_at: '2026-08-21 09:15'
  },
  {
    id: 'ord-3',
    order_ref: 'DT-712390',
    customer_name: 'Camila Morales',
    customer_email: 'camila.m@ejemplo.com',
    customer_phone: '+57 318 901 2345',
    customer_tag: 'Residencial',
    shipping_address: 'Calle 93B # 11A-45, Chico Reservado',
    city: 'Bogotá D.C.',
    carrier: 'Servientrega',
    tracking_number: '550192837',
    subtotal: 1650000,
    shipping_cost: 0,
    discount: 0,
    total: 1650000,
    status: 'delivered',
    payment_method: 'Mercado Pago',
    payment_gateway: 'Mercado Pago',
    items_count: 1,
    items: [
      {
        product_id: 'prod-4',
        name: 'Candelabro Orgánico Hilos de Luz',
        image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=800',
        price: 1650000,
        quantity: 1,
        color: 'Oro Satinado'
      }
    ],
    created_at: '2026-08-19 16:45'
  }
];

const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Order[];
      } catch (err) {
        console.warn('Supabase fetch orders failed, using fallback cache', err);
      }
    }
    return getStoredOrders();
  },

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    const newId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      created_at: orderData.created_at || new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Automatically deduct stock for items in this order
    if (orderData.items && orderData.items.length > 0) {
      try {
        await productService.deductStockForItems(orderData.items);
      } catch (err) {
        console.warn('Could not deduct product stock automatically:', err);
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const payload = {
          order_ref: orderData.order_ref,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone || '',
          customer_tag: orderData.customer_tag || 'Residencial',
          shipping_address: orderData.shipping_address || '',
          city: orderData.city || 'Bogotá D.C.',
          carrier: orderData.carrier || 'Servientrega',
          tracking_number: orderData.tracking_number || '',
          subtotal: Number(orderData.subtotal || orderData.total || 0),
          shipping_cost: Number(orderData.shipping_cost || 0),
          discount: Number(orderData.discount || 0),
          total: Number(orderData.total || 0),
          total_amount: Number(orderData.total || 0),
          status: orderData.status || 'processing',
          payment_method: orderData.payment_method || 'Tarjeta de Crédito',
          payment_gateway: orderData.payment_gateway || 'Wompi Colombia',
          items_count: Number(orderData.items_count || (orderData.items ? orderData.items.length : 1)),
          items: orderData.items || [],
          notes: orderData.notes || '',
          created_at: newOrder.created_at
        };

        const { data, error } = await supabase
          .from('orders')
          .insert([payload])
          .select();

        if (error) {
          console.warn('Supabase primary order insert warning:', error.message);
          // Retry without total_amount if column error
          const { total_amount, ...cleanPayload } = payload;
          const { data: retryData, error: retryErr } = await supabase
            .from('orders')
            .insert([cleanPayload])
            .select();

          if (!retryErr && retryData && retryData.length > 0) {
            console.log('✅ Pedido guardado exitosamente en Supabase Nube:', retryData[0].order_ref);
            if (retryData[0].id) newOrder.id = String(retryData[0].id);
          } else if (retryErr) {
            console.error('❌ Error al guardar pedido en Supabase:', retryErr);
          }
        } else if (data && data.length > 0) {
          console.log('✅ Pedido guardado exitosamente en Supabase Nube:', data[0].order_ref);
          if (data[0].id) newOrder.id = String(data[0].id);
        }
      } catch (err) {
        console.error('Supabase order creation exception:', err);
      }
    }

    const current = getStoredOrders();
    const updated = [newOrder, ...current.filter(o => o.order_ref !== newOrder.order_ref)];
    saveStoredOrders(updated);

    activityLogService.logActivity({
      entity_type: 'order',
      entity_id: newOrder.id,
      entity_name: newOrder.order_ref,
      action: 'create',
      description: `Registró el pedido "${newOrder.order_ref}" para ${newOrder.customer_name}`,
      details: `Total: $${newOrder.total.toLocaleString('es-CO')} COP | Método: ${newOrder.payment_method}`
    });

    notifyOrdersUpdated();
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    return this.updateOrder(id, { status });
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const activeUser = activityLogService.getCurrentUser();
    const nowISO = new Date().toISOString();
    const userLabel = `${activeUser.name} (${activeUser.email})`;

    const fullUpdates: any = {
      ...updates,
      updated_at: nowISO,
      updated_by: userLabel
    };

    const current = getStoredOrders();
    const idx = current.findIndex(o => o.id === id || o.order_ref === id);
    let targetRef = id;
    let targetCustomer = '';

    if (idx !== -1) {
      current[idx] = { ...current[idx], ...fullUpdates };
      saveStoredOrders(current);
      targetRef = current[idx].order_ref || id;
      targetCustomer = current[idx].customer_name || '';
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('orders')
          .update(fullUpdates)
          .or(`id.eq.${id},order_ref.eq.${id}`)
          .select();
        
        if (error && (error.message.includes('updated_at') || error.message.includes('updated_by') || error.message.includes('column'))) {
          const { updated_at, updated_by, ...fallbackPayload } = fullUpdates;
          await supabase.from('orders').update(fallbackPayload).or(`id.eq.${id},order_ref.eq.${id}`);
        }
      } catch (err) {
        console.error('Supabase update order error:', err);
      }
    }

    activityLogService.logActivity({
      entity_type: 'order',
      entity_id: id,
      entity_name: targetRef,
      action: updates.status ? 'status_change' : 'update',
      description: updates.status 
        ? `Cambió el estado del pedido "${targetRef}" a "${updates.status}"${targetCustomer ? ` (${targetCustomer})` : ''}`
        : `Actualizó datos del pedido "${targetRef}"${targetCustomer ? ` (${targetCustomer})` : ''}`,
      details: `Modificaciones: ${Object.keys(updates).join(', ')}`
    });

    notifyOrdersUpdated();
    return idx !== -1 ? current[idx] : null;
  },

  async deleteOrder(id: string): Promise<boolean> {
    const current = getStoredOrders();
    const targetOrder = current.find(o => o.id === id || o.order_ref === id);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').delete().or(`id.eq.${id},order_ref.eq.${id}`);
      } catch (err) {
        console.error('Supabase delete order error:', err);
      }
    }

    const filtered = current.filter(o => o.id !== id && o.order_ref !== id);
    saveStoredOrders(filtered);

    activityLogService.logActivity({
      entity_type: 'order',
      entity_id: id,
      entity_name: targetOrder?.order_ref || id,
      action: 'delete',
      description: `Eliminó el pedido "${targetOrder?.order_ref || id}" (${targetOrder?.customer_name || 'Cliente'})`,
      details: `Monto total: $${(targetOrder?.total || 0).toLocaleString('es-CO')} COP`
    });

    notifyOrdersUpdated();
    return true;
  }
};
