// POST /api/siigo/invoice { orderId } — botón "Emitir Factura Siigo" del panel.
// Solo para admins/colaboradores con sesión; la llave de Siigo vive en el servidor.
import { ServerEnv, dbSelect, getStaffProfile, json } from '../../../server/supabaseAdmin';
import { generateInvoiceForOrder } from '../../../server/siigo';

export async function onRequestPost(context: any) {
  const env = context.env as ServerEnv;
  const staff = await getStaffProfile(env, context.request);
  if (!staff) return json({ error: 'Inicia sesión con una cuenta del equipo para facturar.' }, 401);

  const { orderId } = await context.request.json().catch(() => ({}));
  const id = String(orderId || '');
  const filter = /^[0-9a-f-]{36}$/i.test(id) ? `id=eq.${id}` : /^[A-Za-z0-9-]{3,40}$/.test(id) ? `order_ref=eq.${id}` : null;
  if (!filter) return json({ error: 'Pedido inválido' }, 400);

  const [order] = await dbSelect(env, 'orders', `${filter}&select=*&limit=1`);
  if (!order) return json({ error: 'Pedido no encontrado' }, 404);

  try {
    return json(await generateInvoiceForOrder(env, order));
  } catch (err: any) {
    return json({ error: err.message || 'Error al conectar con Siigo' }, 502);
  }
}
