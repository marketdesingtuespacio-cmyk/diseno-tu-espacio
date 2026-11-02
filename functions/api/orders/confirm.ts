// POST /api/orders/confirm — al volver de Bold, confirma el pago CONSULTANDO A BOLD (no a la URL)
// y solo entonces marca el pedido como pagado y emite la factura en Siigo.
import { ServerEnv, dbSelect, dbUpdate, json } from '../../../server/supabaseAdmin';
import { boldPaymentStatus } from '../../../server/bold';
import { generateInvoiceForOrder } from '../../../server/siigo';

const maskEmail = (email = '') => email.replace(/^(.{2})[^@]*(@.*)$/, '$1•••$2');

const summary = (order: any) => ({
  order_ref: order.order_ref,
  customer_name: String(order.customer_name || '').split(' ')[0],
  customer_email: maskEmail(order.customer_email),
  payment_method: order.payment_method,
  total: Number(order.total || 0),
  items_count: Array.isArray(order.items) ? order.items.reduce((a: number, i: any) => a + Number(i.quantity || 1), 0) : 1,
  items: Array.isArray(order.items) ? order.items.map((i: any) => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity })) : []
});

export async function onRequestPost(context: any) {
  const env = context.env as ServerEnv;
  const { ref } = await context.request.json().catch(() => ({}));
  if (!ref || !/^DT-\d{6,10}$/.test(String(ref))) return json({ error: 'Referencia inválida' }, 400);

  const [order] = await dbSelect(env, 'orders', `order_ref=eq.${ref}&select=*&limit=1`);
  if (!order) return json({ error: 'Pedido no encontrado' }, 404);
  if (order.payment_status === 'paid') return json({ status: 'paid', order: summary(order) });

  const bold = await boldPaymentStatus(env, ref);
  if (bold.status !== 'APPROVED') {
    const final = ['REJECTED', 'FAILED', 'VOIDED'].includes(bold.status);
    return json({ status: final ? 'rejected' : 'pending', bold_status: bold.status });
  }

  const total = Number(order.total || 0);
  if (bold.total < total) {
    await dbUpdate(env, 'orders', `id=eq.${order.id}`, {
      notes: `${order.notes || ''}\n[Bold]: pago aprobado por $${bold.total} pero el pedido es de $${total}. Revisar.`
    });
    return json({ status: 'review', bold_status: bold.status });
  }

  const paid = { status: 'processing', payment_status: 'paid', deposit_amount: total, pending_balance: 0, updated_at: new Date().toISOString(), updated_by: `Bold (${bold.transactionId || 'web'})` };
  // Solo quien logra pasar el pedido a "paid" emite la factura (evita facturas dobles si la página se recarga)
  const changed = await dbUpdate(env, 'orders', `id=eq.${order.id}&payment_status=neq.paid`, paid);
  if (changed.length === 0) return json({ status: 'paid', order: summary({ ...order, ...paid }) });

  // La factura no debe bloquear la confirmación al cliente: si falla queda registrada en el pedido.
  context.waitUntil(generateInvoiceForOrder(env, { ...order, ...paid }).catch(err => console.warn('Siigo:', err)));

  return json({ status: 'paid', order: summary({ ...order, ...paid }) });
}
