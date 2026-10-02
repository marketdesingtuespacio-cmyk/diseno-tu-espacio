import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';
import { productService } from './productService';
import { activityLogService } from './activityLogService';

const LOCAL_STORAGE_DELETED_ORDERS_KEY = 'luxe_deleted_orders_v1';

// Purge any legacy oversized order catalog cache keys from localStorage to prevent QuotaExceededError
export const clearLegacyOrderLocalStorage = () => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('luxe_orders') || key.startsWith('luxe_order') || key.includes('orders_v'))) {
        if (key !== LOCAL_STORAGE_DELETED_ORDERS_KEY) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Error clearing legacy order localStorage keys:', err);
  }
};

// Immediately execute on module load to free up browser storage
clearLegacyOrderLocalStorage();

let memoryOrdersCache: Order[] | null = null;
let isOrderRealtimeSubscribed = false;

export const getDeletedOrderKeys = (): Set<string> => {
  const stored = localStorage.getItem(LOCAL_STORAGE_DELETED_ORDERS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map((s: string) => String(s).toLowerCase().trim()));
      }
    } catch {
      // fallback
    }
  }
  return new Set();
};

export const saveDeletedOrderKeys = (keys: Set<string>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_DELETED_ORDERS_KEY, JSON.stringify(Array.from(keys)));
  } catch (err) {
    console.warn('Error saving deleted order keys:', err);
  }
};

export const addDeletedOrderKey = (...keys: (string | undefined)[]) => {
  const current = getDeletedOrderKeys();
  keys.forEach(k => {
    if (k && k.trim().length > 0) {
      current.add(k.toLowerCase().trim());
    }
  });
  saveDeletedOrderKeys(current);
};

export const isOrderDeleted = (o: { id?: string; order_ref?: string }, deletedSet?: Set<string>): boolean => {
  const set = deletedSet || getDeletedOrderKeys();
  if (!set || set.size === 0) return false;
  if (o.id && set.has(o.id.toLowerCase().trim())) return true;
  if (o.order_ref && set.has(o.order_ref.toLowerCase().trim())) return true;
  return false;
};

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
  const deletedSet = getDeletedOrderKeys();
  if (memoryOrdersCache && memoryOrdersCache.length > 0) {
    return memoryOrdersCache.filter(o => !isOrderDeleted(o, deletedSet));
  }
  return INITIAL_ORDERS.filter(o => !isOrderDeleted(o, deletedSet));
};

const saveStoredOrders = (orders: Order[]) => {
  const deletedSet = getDeletedOrderKeys();
  const clean = orders.filter(o => !isOrderDeleted(o, deletedSet));
  memoryOrdersCache = clean;
  clearLegacyOrderLocalStorage();
};

const buildSupabaseOrderPayload = (orderData: Partial<Order>) => {
  const fullAddress = orderData.city && orderData.shipping_address && !orderData.shipping_address.includes(orderData.city)
    ? `${orderData.shipping_address}, ${orderData.city}`
    : (orderData.shipping_address || '');

  return {
    order_ref: orderData.order_ref,
    customer_name: orderData.customer_name || 'Cliente',
    customer_email: orderData.customer_email || '',
    customer_phone: orderData.customer_phone || '',
    shipping_address: fullAddress,
    total_amount: Number(orderData.total || orderData.subtotal || 0),
    status: orderData.status || 'processing',
    payment_method: orderData.payment_method || 'Tarjeta de Crédito',
    payment_gateway: orderData.payment_gateway || 'Wompi Colombia',
    items: orderData.items || [],
    created_at: orderData.created_at || new Date().toISOString()
  };
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const supabaseOrders = (data as any[]).map(o => ({
            ...o,
            id: String(o.id),
            order_ref: o.order_ref || `DT-${String(o.id).substring(0, 6)}`,
            customer_name: o.customer_name || 'Cliente',
            customer_email: o.customer_email || 'cliente@diseñotuespacio.com',
            customer_phone: o.customer_phone || '',
            customer_tag: o.customer_tag || 'Residencial',
            shipping_address: o.shipping_address || '',
            city: o.city || (o.shipping_address ? o.shipping_address.split(',').pop()?.trim() : '') || 'Bogotá D.C.',
            carrier: o.carrier || 'Servientrega',
            tracking_number: o.tracking_number || '',
            total: Number(o.total_amount || o.total || 0),
            subtotal: Number(o.subtotal || o.total_amount || o.total || 0),
            shipping_cost: Number(o.shipping_cost || 0),
            discount: Number(o.discount || 0),
            payment_method: o.payment_method || 'Tarjeta de Crédito',
            payment_gateway: o.payment_gateway || 'Wompi Colombia',
            status: o.status || 'processing',
            items: o.items || [],
            items_count: Number(o.items_count || (o.items && Array.isArray(o.items) ? o.items.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0) : 1)),
            created_at: o.created_at || new Date().toISOString()
          }));

          saveStoredOrders(supabaseOrders);
          return supabaseOrders;
        }
      } catch (err) {
        console.warn('Supabase fetch orders failed, using fallback cache', err);
      }
    }

    const deletedSet = getDeletedOrderKeys();
    return getStoredOrders().filter(o => !isOrderDeleted(o, deletedSet));
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
        const payload = buildSupabaseOrderPayload(orderData);

        const { data, error } = await supabase
          .from('orders')
          .insert([payload])
          .select();

        if (error) {
          console.error('❌ Error al guardar pedido en Supabase:', error.message);
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

    addDeletedOrderKey(id, targetOrder?.order_ref);

    const filtered = current.filter(o => o.id !== id && o.order_ref !== id);
    saveStoredOrders(filtered);

    if (isSupabaseConfigured()) {
      try {
        // Attempt deleting order items first if order_items table exists
        try {
          await supabase.from('order_items').delete().or(`order_id.eq.${id},order_id.eq.${targetOrder?.id || id}`);
        } catch {
          // Ignore if table or column doesn't exist
        }
        
        await supabase.from('orders').delete().or(`id.eq.${id},order_ref.eq.${id}${targetOrder?.order_ref ? `,order_ref.eq.${targetOrder.order_ref}` : ''}`);
      } catch (err) {
        console.error('Supabase delete order error:', err);
      }
    }

    try {
      activityLogService.logActivity({
        entity_type: 'order',
        entity_id: id,
        entity_name: targetOrder?.order_ref || id,
        action: 'delete',
        description: `Eliminó el pedido "${targetOrder?.order_ref || id}" (${targetOrder?.customer_name || 'Cliente'})`,
        details: `Monto total: $${(targetOrder?.total || 0).toLocaleString('es-CO')} COP`
      });
    } catch {
      // Non-blocking log failure
    }

    notifyOrdersUpdated();
    return true;
  },

  async syncAllToSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, count: 0, message: 'Supabase no está configurado en las variables de entorno.' };
    }

    try {
      localStorage.removeItem(LOCAL_STORAGE_DELETED_ORDERS_KEY);
      const { data: dbOrders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (error) {
        return { success: false, count: 0, message: `Error al consultar pedidos de Supabase: ${error.message}` };
      }

      if (dbOrders && dbOrders.length > 0) {
        saveStoredOrders(dbOrders as Order[]);
        notifyOrdersUpdated();
      }

      return {
        success: true,
        count: dbOrders?.length || 0,
        message: `¡Caché de pedidos actualizada! Se sincronizaron ${dbOrders?.length || 0} pedidos desde Supabase Nube (Fuente Única de Verdad).`
      };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        message: `Excepción al refrescar pedidos desde Supabase: ${err?.message || 'Error desconocido'}`
      };
    }
  }
};

