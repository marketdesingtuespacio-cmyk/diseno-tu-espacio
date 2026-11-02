// POST /api/bold/webhook — aviso de Bold cuando cambia un pago (configurado en el panel de Bold).
// Confirma el pago aunque el cliente nunca vuelva a la tienda (cerró la pestaña, PSE tardó, etc.).
// El aviso no se toma como prueba: solo dice QUÉ referencia revisar, y la confirmación vuelve a
// consultar el estado real a la API de Bold (los mismos endpoints que usa la página al volver).
import { onRequestPost as confirmOrder } from '../orders/confirm';
import { onRequestPost as appointmentAction } from '../appointments/[action]';

const ORDER_REF = /DT-\d{6,10}/;
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export async function onRequestPost(context: any) {
  const raw = await context.request.text();
  let event: any = {};
  try { event = JSON.parse(raw); } catch { /* cuerpo inválido: se responde 200 igual para que Bold no reintente basura */ }

  // Bold manda la referencia de la orden en data.metadata.reference
  const reference = String(event?.data?.metadata?.reference || '');
  const call = (handler: any, body: object, params: object = {}) => handler({
    ...context,
    params,
    request: new Request(context.request.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  });

  // Bold exige respuesta en menos de 2 s: la confirmación corre en segundo plano
  const work = async () => {
    let result: Response | null = null;
    if (ORDER_REF.test(reference)) {
      result = await call(confirmOrder, { ref: reference.match(ORDER_REF)![0] });
    } else if (UUID.test(reference)) {
      result = await call(appointmentAction, { appointmentId: reference.match(UUID)![0] }, { action: 'confirm' });
    }
    const outcome = result ? await result.json().catch(() => ({})) : { status: 'ignored' };
    console.log('Bold webhook', event?.type, reference || '(sin referencia)', outcome?.status);
  };
  context.waitUntil(work().catch(err => console.warn('Bold webhook:', err)));
  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
