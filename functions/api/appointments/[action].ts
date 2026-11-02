// POST /api/appointments/pay      { appointmentId } → firma de Bold con el precio oficial del servicio
// POST /api/appointments/confirm  { appointmentId } → consulta a Bold y marca la cita como pagada
import { ServerEnv, dbSelect, dbUpdate, json } from '../../../server/supabaseAdmin';
import { boldButtonConfig, boldPaymentStatus } from '../../../server/bold';

// Mismos precios que SERVICES en src/pages/BookingPage.tsx (si cambian allá, cambiarlos aquí)
const SERVICE_PRICES: Record<string, number> = {
  'Asesoría de Iluminación Residencial': 150000,
  'Visita de Diseño de Interiores In-Situ': 250000,
  'Proyecto Llave en Mano VIP': 500000
};

const maskEmail = (email = '') => email.replace(/^(.{2})[^@]*(@.*)$/, '$1•••$2');

const publicAppointment = (a: any) => ({
  id: a.id,
  customer_name: a.customer_name,
  customer_email: maskEmail(a.customer_email),
  customer_phone: '',
  service_type: a.service_type,
  appointment_date: a.appointment_date,
  appointment_time: a.appointment_time,
  city: a.city,
  status: a.status,
  payment_status: a.payment_status,
  price: Number(a.price || 0)
});

export async function onRequestPost(context: any) {
  const env = context.env as ServerEnv;
  const action = context.params.action;
  const { appointmentId } = await context.request.json().catch(() => ({}));
  if (!/^[0-9a-f-]{36}$/i.test(String(appointmentId || ''))) return json({ error: 'Cita inválida' }, 400);

  const [appointment] = await dbSelect(env, 'appointments', `id=eq.${appointmentId}&select=*&limit=1`);
  if (!appointment) return json({ error: 'Cita no encontrada' }, 404);

  if (action === 'pay') {
    if (appointment.payment_status === 'paid') return json({ error: 'Esta cita ya está pagada.' }, 409);
    const price = SERVICE_PRICES[appointment.service_type];
    if (!price) return json({ error: 'Servicio no reconocido' }, 400);
    if (Number(appointment.price) !== price) await dbUpdate(env, 'appointments', `id=eq.${appointment.id}`, { price });
    return json({ bold: await boldButtonConfig(env, appointment.id, price) });
  }

  if (action === 'confirm') {
    if (appointment.payment_status === 'paid') return json({ status: 'paid', appointment: publicAppointment(appointment) });
    const bold = await boldPaymentStatus(env, appointment.id);
    if (bold.status !== 'APPROVED') {
      const final = ['REJECTED', 'FAILED', 'VOIDED'].includes(bold.status);
      return json({ status: final ? 'rejected' : 'pending', bold_status: bold.status });
    }
    const price = SERVICE_PRICES[appointment.service_type] || Number(appointment.price);
    if (bold.total < price) return json({ status: 'review', bold_status: bold.status });
    const [updated] = await dbUpdate(env, 'appointments', `id=eq.${appointment.id}`, { payment_status: 'paid', status: 'confirmed' });
    return json({ status: 'paid', appointment: publicAppointment(updated || appointment) });
  }

  return json({ error: 'Acción no válida' }, 404);
}
