// ==============================================================================
// Facturación electrónica Siigo Nube — corre SOLO en el servidor (Cloudflare Pages Functions).
// Usuario y access key de Siigo viven en variables de entorno, nunca en el navegador.
// Regla de negocio: Bold / Addi / tarjeta / PSE / Nequi => factura electrónica; Efectivo => no.
// ==============================================================================
import { ServerEnv, dbUpdate } from './supabaseAdmin';

const SIIGO_API = 'https://api.siigo.com';
let cachedAuth: { token: string; expiresAt: number } | null = null;

const config = (env: ServerEnv) => ({
  partnerId: env.SIIGO_PARTNER_ID || 'DisenoTuEspacio',
  documentId: Number(env.SIIGO_DOCUMENT_ID || 10367),
  sellerId: Number(env.SIIGO_SELLER_ID || 10760),
  paymentIdBold: Number(env.SIIGO_PAYMENT_ID_BOLD || 2389),
  paymentIdAddi: Number(env.SIIGO_PAYMENT_ID_ADDI || 2389)
});

async function authToken(env: ServerEnv): Promise<string> {
  const now = Date.now();
  if (cachedAuth && cachedAuth.expiresAt > now + 60000) return cachedAuth.token;

  const res = await fetch(`${SIIGO_API}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: env.SIIGO_USERNAME, access_key: env.SIIGO_ACCESS_KEY })
  });
  if (!res.ok) throw new Error(`Error de autenticación con Siigo (${res.status}): ${await res.text()}`);
  const data = await res.json();
  cachedAuth = { token: data.access_token, expiresAt: now + (data.expires_in ? data.expires_in * 1000 : 23 * 3600 * 1000) };
  return cachedAuth.token;
}

async function siigoHeaders(env: ServerEnv) {
  return {
    Authorization: `Bearer ${await authToken(env)}`,
    'Content-Type': 'application/json',
    'Partner-Id': config(env).partnerId
  };
}

export function requiresElectronicInvoice(order: any): boolean {
  const method = (order.payment_method || '').toLowerCase();
  const gateway = (order.payment_gateway || '').toLowerCase();
  if (method.includes('efectivo') || gateway.includes('efectivo')) return false;
  return ['bold', 'addi'].some(k => method.includes(k) || gateway.includes(k))
    || ['tarjeta', 'pse', 'nequi'].some(k => method.includes(k));
}

async function ensureCustomer(env: ServerEnv, order: any): Promise<void> {
  const headers = await siigoHeaders(env);
  const documentId = (order.customer_document_id || '').trim() || '222222222222';
  const documentType = order.customer_document_type || 'CC';
  const fullName = (order.customer_name || 'Cliente Diseñotuespacio').trim();
  const parts = fullName.split(' ');
  const firstName = parts[0] || 'Cliente';
  const lastName = parts.slice(1).join(' ') || 'General';
  const phone = (order.customer_phone || '3000000000').replace(/[^0-9]/g, '').slice(-10);

  try {
    const search = await fetch(`${SIIGO_API}/v1/customers?identification=${encodeURIComponent(documentId)}`, { headers });
    if (search.ok) {
      const data = await search.json();
      if (data.results && data.results.length > 0) return;
    }
  } catch (err) {
    console.warn('Advertencia buscando cliente en Siigo:', err);
  }

  const res = await fetch(`${SIIGO_API}/v1/customers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'Customer',
      person_type: documentType === 'NIT' ? 'Company' : 'Person',
      id_type: documentType === 'NIT' ? '31' : '13', // 13: Cédula, 31: NIT
      identification: documentId,
      name: documentType === 'NIT' ? [fullName] : [firstName, lastName],
      commercial_name: fullName,
      address: {
        address: order.shipping_address || 'Dirección General',
        city: { country_code: 'Co', state_code: '05', city_code: '05001' }
      },
      phones: [{ indicative: '57', number: phone }],
      contacts: [{
        first_name: firstName,
        last_name: lastName,
        email: order.customer_email || 'facturacion@disenotuespacio.com',
        phone: { indicative: '57', number: phone }
      }],
      fiscal_responsibilities: [{ code: 'R-99-PN' }]
    })
  });
  if (!res.ok) throw new Error(`No se pudo registrar cliente en Siigo: ${await res.text()}`);
}

/** Emite la factura electrónica de un pedido y guarda el resultado en orders. */
export async function generateInvoiceForOrder(env: ServerEnv, order: any): Promise<{ invoiceId: string; invoiceNumber: string; pdfUrl?: string }> {
  if (!requiresElectronicInvoice(order)) {
    await dbUpdate(env, 'orders', `id=eq.${order.id}`, {
      siigo_invoice_status: 'not_applicable',
      notes: `${order.notes || ''}\n[Siigo]: Venta en efectivo no sujeta a factura electrónica web.`
    });
    throw new Error('Esta orden fue pagada en Efectivo y no genera factura electrónica automática.');
  }

  const cfg = config(env);
  const headers = await siigoHeaders(env);
  await ensureCustomer(env, order);
  const documentId = (order.customer_document_id || '').trim() || '222222222222';
  const isAddi = `${order.payment_method || ''} ${order.payment_gateway || ''}`.toLowerCase().includes('addi');
  const total = Number(order.total || 0);
  const today = new Date().toISOString().split('T')[0];

  // Precios con IVA 19% incluido => se envía la base antes de IVA
  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map((item: any) => ({
        code: '1',
        description: item.name,
        quantity: item.quantity,
        price: Math.round((Number(item.price) / 1.19) * 100) / 100,
        discount: 0,
        taxes: [{ id: 5575 }]
      }))
    : [{
        code: '1',
        description: `Pedido ${order.order_ref} - Diseño Tu Espacio`,
        quantity: 1,
        price: Math.round((total / 1.19) * 100) / 100,
        discount: 0,
        taxes: [{ id: 5575 }]
      }];

  const res = await fetch(`${SIIGO_API}/v1/invoices`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      document: { id: cfg.documentId },
      date: today,
      customer: { identification: documentId },
      seller: cfg.sellerId,
      items,
      payments: [{ id: isAddi ? cfg.paymentIdAddi : cfg.paymentIdBold, value: total, due_date: today }],
      observations: `Pedido tienda virtual: ${order.order_ref}. Pasarela: ${order.payment_gateway || order.payment_method}`
    })
  });

  if (!res.ok) {
    const detail = await res.text();
    await dbUpdate(env, 'orders', `id=eq.${order.id}`, { siigo_invoice_status: 'failed', siigo_error_log: detail.substring(0, 500) });
    throw new Error(`Error en Siigo (${res.status}): ${detail}`);
  }

  const invoice = await res.json();
  const invoiceNumber = invoice.name || `FV-${invoice.number || invoice.id}`;
  const pdfUrl = invoice.public_url || null;
  await dbUpdate(env, 'orders', `id=eq.${order.id}`, {
    siigo_invoice_id: invoice.id,
    siigo_invoice_number: invoiceNumber,
    siigo_invoice_status: 'generated',
    siigo_pdf_url: pdfUrl,
    siigo_error_log: null
  });
  return { invoiceId: invoice.id, invoiceNumber, pdfUrl: pdfUrl || undefined };
}
