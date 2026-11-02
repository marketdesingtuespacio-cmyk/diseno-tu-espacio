// POST /api/orders/create — crea el pedido de la tienda web desde el servidor.
// Los precios salen de la tabla products (no del navegador) y la firma de Bold se genera aquí.
import { ServerEnv, dbSelect, dbInsert, dbUpdate, json } from '../../../server/supabaseAdmin';
import { boldButtonConfig } from '../../../server/bold';
import { COLOMBIAN_SHIPPING_RATES } from '../../../src/services/shippingService';

const FREE_SHIPPING_FROM = 1500000;
const PAYMENT_GATEWAY = 'Bold Payments (Colombia)';
const PAYMENT_METHODS = ['Tarjetas de Crédito / Débito', 'PSE (Débito Bancario)', 'Nequi / Daviplata', 'Botón de Pago Bold'];

const clean = (value: unknown, max = 200) => String(value ?? '').trim().slice(0, max);

function newOrderRef(): string {
  const bytes = crypto.getRandomValues(new Uint32Array(1));
  return `DT-${(10000000 + (bytes[0] % 90000000)).toString()}`;
}

async function deductWebStock(env: ServerEnv, product: any, qty: number) {
  const store = product.store_stock ?? 0;
  const warehouse = product.warehouse_stock ?? 0;
  const web = Math.max(0, (product.web_stock ?? product.stock ?? 0) - qty);
  const calculated = store + warehouse + web;
  const stock = calculated > 0 ? calculated : Math.max(0, (product.stock ?? 0) - qty);
  const inventory_status = stock <= 0 ? 'Agotado' : stock <= 3 ? 'Poco Stock' : 'Disponible';
  await dbUpdate(env, 'products', `id=eq.${product.id}`, {
    stock, web_stock: web, inventory_status, updated_at: new Date().toISOString()
  });
}

export async function onRequestPost(context: any) {
  const env = context.env as ServerEnv;
  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Solicitud inválida' }, 400);
  }

  const customer = body.customer || {};
  const fullName = clean(customer.fullName, 120);
  const email = clean(customer.email, 160);
  const phone = clean(customer.phone, 30);
  if (!fullName || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, '').length < 7) {
    return json({ error: 'Completa nombre, correo y teléfono válidos.' }, 400);
  }

  const requested: { product_id: string; quantity: number }[] = (Array.isArray(body.items) ? body.items : [])
    .slice(0, 50)
    .map((i: any) => ({ product_id: clean(i.product_id, 60), quantity: Math.floor(Number(i.quantity)) }))
    .filter((i: any) => /^[0-9a-f-]{36}$/i.test(i.product_id) && i.quantity >= 1 && i.quantity <= 100);
  if (requested.length === 0) return json({ error: 'El carrito está vacío.' }, 400);

  const ids = [...new Set(requested.map(i => i.product_id))];
  const products = await dbSelect(env, 'products', `id=in.(${ids.join(',')})&select=*`);
  const byId = new Map(products.map((p: any) => [p.id, p]));
  if (requested.some(i => !byId.has(i.product_id))) {
    return json({ error: 'Un producto del carrito ya no está disponible. Actualiza la página.' }, 409);
  }

  const items = requested.map(i => {
    const p: any = byId.get(i.product_id);
    return {
      product_id: p.id,
      name: p.name,
      image: (p.images && p.images[0]) || '',
      price: Number(p.price),
      quantity: i.quantity,
      color: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors[0].name : undefined,
      stock_location: 'web' as const
    };
  });

  const rate = COLOMBIAN_SHIPPING_RATES.find(r => r.id === body.cityRateId) || COLOMBIAN_SHIPPING_RATES[0];
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCost = subtotal > FREE_SHIPPING_FROM ? 0 : rate.cost;
  const total = subtotal + shippingCost;
  const address = clean(customer.address, 300);
  const shippingAddress = rate.id === 'ship-pickup' && !address ? 'Retiro en Tienda / Showroom Medellín' : address;
  const orderRef = newOrderRef();

  const [order] = await dbInsert(env, 'orders', {
    order_ref: orderRef,
    customer_name: fullName,
    customer_email: email,
    customer_phone: phone,
    customer_document_type: 'CC',
    customer_document_id: clean(customer.documentId, 20) || '222222222222',
    shipping_address: shippingAddress && !shippingAddress.includes(rate.city) ? `${shippingAddress}, ${rate.city}` : shippingAddress,
    city: rate.city,
    subtotal,
    shipping_cost: shippingCost,
    discount: 0,
    total,
    deposit_amount: 0,
    pending_balance: total,
    payment_status: 'pending',
    status: 'pending',
    payment_method: PAYMENT_METHODS.includes(body.paymentMethod) ? body.paymentMethod : PAYMENT_METHODS[0],
    payment_gateway: PAYMENT_GATEWAY,
    siigo_invoice_status: 'pending',
    items,
    notes: clean(customer.notes, 1000)
  });

  try {
    await dbInsert(env, 'order_items', items.map(i => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.price,
      total_price: i.price * i.quantity,
      product_snapshot: i
    })));
  } catch (err) {
    console.warn('order_items no disponible:', err);
  }

  for (const i of items) {
    try {
      await deductWebStock(env, byId.get(i.product_id), i.quantity);
    } catch (err) {
      console.warn('No se pudo descontar stock:', err);
    }
  }

  return json({
    order: { order_ref: orderRef, total, subtotal, shipping_cost: shippingCost, items_count: items.reduce((a, i) => a + i.quantity, 0) },
    bold: await boldButtonConfig(env, orderRef, total)
  });
}
