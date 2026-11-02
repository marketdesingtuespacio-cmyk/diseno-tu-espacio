// Bold Colombia (Botón de pagos): la firma de integridad y la consulta del pago se hacen
// en el servidor. La llave secreta nunca llega al navegador.
import { ServerEnv } from './supabaseAdmin';

/** Firma oficial Bold: SHA256(orderId + amount + currency + secretKey) */
export async function boldSignature(env: ServerEnv, orderId: string, amount: number, currency = 'COP'): Promise<string> {
  const raw = `${orderId}${Math.round(amount)}${currency}${env.BOLD_SECRET_KEY}`;
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Datos que el navegador necesita para montar el botón de Bold (sin la llave secreta). */
export async function boldButtonConfig(env: ServerEnv, orderId: string, amount: number) {
  return {
    orderId,
    amount: Math.round(amount),
    currency: 'COP',
    identityKey: env.BOLD_IDENTITY_KEY,
    signature: await boldSignature(env, orderId, amount)
  };
}

export type BoldStatus = 'APPROVED' | 'REJECTED' | 'FAILED' | 'VOIDED' | 'PROCESSING' | 'PENDING' | 'NO_TRANSACTION_FOUND';

/**
 * Consulta en Bold el estado real de la venta (https://developers.bold.co/pagos-en-linea/seguimiento-de-transacciones).
 * Justo al volver del pago Bold puede responder NO_TRANSACTION_FOUND por unos segundos.
 */
export async function boldPaymentStatus(env: ServerEnv, orderId: string): Promise<{ status: BoldStatus; total: number; transactionId?: string; paymentMethod?: string }> {
  const res = await fetch(`https://payments.api.bold.co/v2/payment-voucher/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `x-api-key ${env.BOLD_IDENTITY_KEY}` }
  });
  if (res.status === 404) return { status: 'NO_TRANSACTION_FOUND', total: 0 };
  if (!res.ok) throw new Error(`Bold (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return {
    status: data.payment_status,
    total: Number(data.total || 0),
    transactionId: data.transaction_id,
    paymentMethod: data.payment_method
  };
}
