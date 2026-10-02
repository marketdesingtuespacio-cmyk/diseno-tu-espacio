import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';
import { productService } from './productService';
import { activityLogService } from './activityLogService';

// Purge any legacy oversized order catalog cache keys from localStorage to prevent QuotaExceededError
export const clearLegacyOrderLocalStorage = () => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('luxe_orders') || key.startsWith('luxe_order') || key.includes('orders_v') || key.startsWith('luxe_deleted_orders'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Error clearing legacy order localStorage keys:', err);
  }
};

// Immediately execute on module load to free up browser storage
clearLegacyOrderLocalStorage();

// Legacy stubs kept for backward compatibility (no localStorage persistence)
export const getDeletedOrderKeys = (): Set<string> => new Set();
export const saveDeletedOrderKeys = (_keys: Set<string>) => {};
export const addDeletedOrderKey = (..._keys: (string | undefined)[]) => {};
export const isOrderDeleted = (_o: { id?: string; order_ref?: string }): boolean => false;

let memoryOrdersCache: Order[] | null = null;
let ordersFetchPromise: Promise<Order[]> | null = null;
let isOrderRealtimeSubscribed = false;

export const clearOrderCache = () => {
  memoryOrdersCache = null;
  ordersFetchPromise = null;
};

export const notifyOrdersUpdated = () => {
  clearOrderCache();
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
          clearOrderCache();
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
  }
];

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
    if (ordersFetchPromise) {
      return ordersFetchPromise;
    }

    ordersFetchPromise = (async () => {
      let fetchedOrders: Order[] = [];

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            fetchedOrders = (data as any[]).map(o => ({
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
          } else if (error) {
            console.warn('Supabase fetch orders error:', error.message);
          }
        } catch (err) {
          console.warn('Supabase fetch orders exception:', err);
        }
      }

      if (fetchedOrders.length === 0) {
        fetchedOrders = memoryOrdersCache || INITIAL_ORDERS;
      }

      memoryOrdersCache = fetchedOrders;
      ordersFetchPromise = null;
      return fetchedOrders;
    })();

    return ordersFetchPromise;
  },

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    const newId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      created_at: orderData.created_at || new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

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

          if (newOrder.items && newOrder.items.length > 0 && data[0].id) {
            try {
              const relationalItems = newOrder.items.map(item => ({
                order_id: data[0].id,
                product_id: (item.product_id && item.product_id.length > 20 && !item.product_id.startsWith('prod-')) ? item.product_id : null,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
                product_snapshot: item
              }));
              await supabase.from('order_items').insert(relationalItems);
            } catch {
              // Ignore if order_items table is not active
            }
          }
        }
      } catch (err) {
        console.error('Supabase order creation exception:', err);
      }
    }

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

    if (isSupabaseConfigured()) {
      try {
        const isNumeric = !isNaN(Number(id)) && Number.isInteger(Number(id));
        let query = supabase.from('orders').update(fullUpdates);
        if (isNumeric) {
          query = query.eq('id', Number(id));
        } else {
          query = query.eq('order_ref', id);
        }
        
        const { error } = await query.select();
        
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
      entity_name: id,
      action: updates.status ? 'status_change' : 'update',
      description: updates.status 
        ? `Cambió el estado del pedido "${id}" a "${updates.status}"`
        : `Actualizó datos del pedido "${id}"`,
      details: `Modificaciones: ${Object.keys(updates).join(', ')}`
    });

    notifyOrdersUpdated();
    return null;
  },

  async deleteOrder(id: string): Promise<boolean> {
    clearOrderCache();
    let isSuccess = false;

    if (isSupabaseConfigured()) {
      try {
        // 1. Clean relational order_items by order_id (primary UUID or text)
        try {
          await supabase.from('order_items').delete().eq('order_id', id);
          const numericId = Number(id);
          if (!isNaN(numericId) && Number.isInteger(numericId)) {
            await supabase.from('order_items').delete().eq('order_id', numericId);
          }
        } catch {
          // ignore if table doesn't exist
        }

        // 2. Strict primary delete by id (UUID or PK) on Supabase orders table
        let { error: primaryErr } = await supabase.from('orders').delete().eq('id', id);
        
        if (!primaryErr) {
          isSuccess = true;
          console.log('✅ Pedido eliminado por UUID/id en Supabase Nube:', id);
        } else {
          // Fallback if id passed is numeric or order_ref
          const numericId = Number(id);
          if (!isNaN(numericId) && Number.isInteger(numericId)) {
            const { error: errNum } = await supabase.from('orders').delete().eq('id', numericId);
            if (!errNum) isSuccess = true;
          }
          if (!isSuccess) {
            const { error: errRef } = await supabase.from('orders').delete().eq('order_ref', id);
            if (!errRef) isSuccess = true;
          }
        }
      } catch (err) {
        console.error('Excepción al eliminar pedido en Supabase:', err);
        isSuccess = false;
      }
    }

    if (memoryOrdersCache) {
      memoryOrdersCache = memoryOrdersCache.filter(o => o.id !== id && o.order_ref !== id);
    }

    try {
      activityLogService.logActivity({
        entity_type: 'order',
        entity_id: id,
        entity_name: id,
        action: 'delete',
        description: `Eliminó el pedido con ID/Ref "${id}"`
      });
    } catch {
      // Non-blocking log failure
    }

    notifyOrdersUpdated();
    return isSuccess;
  },

  async syncAllToSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, count: 0, message: 'Supabase no está configurado en las variables de entorno.' };
    }

    try {
      const { data: dbOrders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (error) {
        return { success: false, count: 0, message: `Error al consultar pedidos de Supabase: ${error.message}` };
      }

      notifyOrdersUpdated();

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
