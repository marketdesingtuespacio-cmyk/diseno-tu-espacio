// ==============================================================================
// ⚡ DISEÑO TU ESPACIO - FACTURACIÓN ELECTRÓNICA SIIGO NUBE (cliente)
// ==============================================================================
// La emisión corre en el servidor (functions/api/siigo/invoice.ts + server/siigo.ts):
// el usuario y la access key de Siigo NUNCA viajan al navegador.
// Regla de negocio: 'Pago por Bold' / 'Crédito Addi' => factura; 'Efectivo' => no.

import { Order } from '../types';
import { supabase } from '../lib/supabase';
import { notifyOrdersUpdated } from './orderService';

export const siigoInvoiceService = {
  // Emite (o reintenta) la factura de un pedido. Requiere sesión de admin/colaborador.
  async generateInvoiceForOrder(order: Order): Promise<{
    invoiceId: string;
    invoiceNumber: string;
    cufe?: string;
    pdfUrl?: string;
  }> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('Inicia sesión con tu cuenta del equipo para emitir facturas.');

    const response = await fetch('/api/siigo/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId: order.id || order.order_ref })
    });
    const result = await response.json().catch(() => ({}));
    notifyOrdersUpdated();
    if (!response.ok) throw new Error(result.error || `Error en Siigo (${response.status})`);
    return result;
  }
};
