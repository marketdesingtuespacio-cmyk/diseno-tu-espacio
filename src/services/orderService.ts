import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';
import { productService } from './productService';

const LOCAL_STORAGE_ORDERS_KEY = 'luxe_orders_cache_v2';

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
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
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
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            order_ref: orderData.order_ref,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            total_amount: orderData.total,
            status: orderData.status,
            payment_gateway: orderData.payment_gateway,
            payment_method: orderData.payment_method,
            items: orderData.items || [],
            shipping_address: orderData.shipping_address || ''
          }])
          .select()
          .single();
        if (!error && data) return data as Order;
      } catch (err) {
        console.error('Supabase order creation error:', err);
      }
    }

    const current = getStoredOrders();
    const updated = [newOrder, ...current];
    saveStoredOrders(updated);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    return this.updateOrder(id, { status });
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Order;
      } catch (err) {
        console.error('Supabase update order error:', err);
      }
    }

    const current = getStoredOrders();
    const idx = current.findIndex(o => o.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      saveStoredOrders(current);
      return current[idx];
    }
    return null;
  }
};
