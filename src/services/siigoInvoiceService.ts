// ==============================================================================
// ⚡ DISEÑO TU ESPACIO - SERVICIO OFICIAL DE FACTURACIÓN ELECTRÓNICA SIIGO NUBE
// ==============================================================================
// Este servicio maneja:
// 1. Autenticación automática con renovación de Bearer Token ante Siigo.
// 2. Consulta y creación de Clientes en Siigo (Terceros) con Cédula o NIT.
// 3. Emisión de Facturas de Venta / Factura Electrónica en Siigo.
// 4. Regla de Negocio:
//    - 'Pago por Bold' o 'Crédito Addi' => Emite Factura Electrónica.
//    - 'Efectivo' (Tienda física / Showroom) => NO emite factura electrónica.

import { Order } from '../types';
import { orderService } from './orderService';

export interface SiigoAuthConfig {
  apiUrl: string;
  username: string;
  accessKey: string;
  partnerId: string;
  documentId: number;
  sellerId: number;
  paymentIdBold: number;
  paymentIdAddi: number;
}

interface CachedToken {
  token: string;
  expiresAt: number; // timestamp ms
}

let cachedAuth: CachedToken | null = null;

export const siigoInvoiceService = {
  getConfig(): SiigoAuthConfig {
    return {
      apiUrl: import.meta.env.VITE_SIIGO_API_URL || 'https://api.siigo.com',
      username: import.meta.env.VITE_SIIGO_USERNAME || 'disenotuespacio9@gmail.com',
      accessKey: import.meta.env.VITE_SIIGO_ACCESS_KEY || 'NDI0OGIxY2EtNGVhNy00ZGJhLWI2ZWQtMWZmYzJjMzA5Y2QzOihjbzJRTyoua0U=',
      partnerId: import.meta.env.VITE_SIIGO_PARTNER_ID || 'DisenoTuEspacio',
      documentId: Number(import.meta.env.VITE_SIIGO_DOCUMENT_ID || 10367),
      sellerId: Number(import.meta.env.VITE_SIIGO_SELLER_ID || 10760),
      paymentIdBold: Number(import.meta.env.VITE_SIIGO_PAYMENT_ID_BOLD || 2389),
      paymentIdAddi: Number(import.meta.env.VITE_SIIGO_PAYMENT_ID_ADDI || 2389)
    };
  },

  // 1. Obtiene o renueva el token JWT de Siigo
  async getAuthToken(): Promise<string> {
    const now = Date.now();
    if (cachedAuth && cachedAuth.expiresAt > now + 60000) {
      return cachedAuth.token;
    }

    const { apiUrl, username, accessKey } = this.getConfig();

    const response = await fetch(`${apiUrl}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        access_key: accessKey
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error de autenticación con Siigo (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const token = data.access_token;
    // Siigo entrega tokens con validez de 24 horas (86400 seg)
    cachedAuth = {
      token,
      expiresAt: now + (data.expires_in ? data.expires_in * 1000 : 23 * 3600 * 1000)
    };

    return token;
  },

  // 2. Encabezados HTTP requeridos por Siigo (incluye Partner-Id obligatorio)
  async getHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const { partnerId } = this.getConfig();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Partner-Id': partnerId
    };
  },

  // 3. Determina si una orden requiere emisión de Factura Electrónica
  requiresElectronicInvoice(order: Order): boolean {
    const method = (order.payment_method || '').toLowerCase();
    const gateway = (order.payment_gateway || '').toLowerCase();

    // Efectivo en tienda física o showroom: NO se factura electrónicamente
    if (method.includes('efectivo') || gateway.includes('efectivo')) {
      return false;
    }

    // Bold y Addi sí facturan electrónicamente
    if (
      method.includes('bold') ||
      gateway.includes('bold') ||
      method.includes('addi') ||
      gateway.includes('addi') ||
      method.includes('tarjeta') ||
      method.includes('pse') ||
      method.includes('nequi')
    ) {
      return true;
    }

    return false;
  },

  // 4. Asegura que el cliente (Tercero) exista en Siigo antes de facturar
  async ensureCustomerInSiigo(order: Order): Promise<string> {
    const headers = await this.getHeaders();
    const { apiUrl } = this.getConfig();

    // Documento de identidad fiscal (CC / NIT). Si no existe, usar consumidor final DIAN
    const documentId = (order.customer_document_id || '').trim() || '222222222222';
    const documentType = order.customer_document_type || (documentId === '222222222222' ? 'CC' : 'CC');

    // Separar nombres
    const fullName = (order.customer_name || 'Cliente Diseñotuespacio').trim();
    const parts = fullName.split(' ');
    const firstName = parts[0] || 'Cliente';
    const lastName = parts.slice(1).join(' ') || 'General';

    // 4.1 Buscar si el cliente ya existe por número de identificación
    try {
      const searchRes = await fetch(`${apiUrl}/v1/customers?identification=${encodeURIComponent(documentId)}`, {
        method: 'GET',
        headers
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          return searchData.results[0].id;
        }
      }
    } catch (err) {
      console.warn('Advertencia buscando cliente en Siigo:', err);
    }

    // 4.2 Crear el cliente si no existe
    const customerPayload = {
      type: 'Customer',
      person_type: documentType === 'NIT' ? 'Company' : 'Person',
      id_type: documentType === 'NIT' ? '31' : '13', // 13: Cédula de ciudadanía, 31: NIT
      identification: documentId,
      name: documentType === 'NIT' ? [fullName] : [firstName, lastName],
      commercial_name: fullName,
      address: {
        address: order.shipping_address || 'Dirección General',
        city: {
          country_code: 'Co',
          state_code: '05', // Antioquia / General
          city_code: '05001' // Medellín
        }
      },
      phones: [
        {
          indicative: '57',
          number: (order.customer_phone || '3000000000').replace(/[^0-9]/g, '').slice(-10)
        }
      ],
      contacts: [
        {
          first_name: firstName,
          last_name: lastName,
          email: order.customer_email || 'facturacion@disenotuespacio.com',
          phone: {
            indicative: '57',
            number: (order.customer_phone || '3000000000').replace(/[^0-9]/g, '').slice(-10)
          }
        }
      ],
      fiscal_responsibilities: [
        {
          code: 'R-99-PN' // No responsable de IVA para personas naturales
        }
      ]
    };

    const createRes = await fetch(`${apiUrl}/v1/customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(customerPayload)
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`No se pudo registrar cliente en Siigo: ${errText}`);
    }

    const createdCustomer = await createRes.json();
    return createdCustomer.id;
  },

  // 5. Emite la Factura Electrónica en Siigo para una orden
  async generateInvoiceForOrder(order: Order): Promise<{
    invoiceId: string;
    invoiceNumber: string;
    pdfUrl?: string;
  }> {
    // Si la orden no califica (por ejemplo es Efectivo), no se factura
    if (!this.requiresElectronicInvoice(order)) {
      await orderService.updateOrder(order.id, {
        siigo_invoice_status: 'not_applicable',
        notes: `${order.notes || ''}\n[Siigo]: Venta en efectivo no sujeta a factura electrónica web.`
      });
      throw new Error('Esta orden fue pagada en Efectivo y no genera factura electrónica automática.');
    }

    const headers = await this.getHeaders();
    const config = this.getConfig();

    // 5.1 Garantizar que el cliente exista en Siigo
    const customerId = await this.ensureCustomerInSiigo(order);

    // 5.2 Determinar forma de pago contable según método
    const isAddi = (order.payment_method || '').toLowerCase().includes('addi') || (order.payment_gateway || '').toLowerCase().includes('addi');
    const paymentId = isAddi ? config.paymentIdAddi : config.paymentIdBold;

    // 5.3 Preparar ítems de la orden para Siigo
    const invoiceItems = (order.items && order.items.length > 0)
      ? order.items.map(item => ({
          code: '1', // Mercancía no fabricada por la empresa
          description: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: 0,
          taxes: [
            {
              id: 5575 // IVA 19% oficial en Siigo
            }
          ]
        }))
      : [
          {
            code: '1',
            description: `Pedido ${order.order_ref} - Diseño Tu Espacio`,
            quantity: 1,
            price: order.total,
            discount: 0,
            taxes: [{ id: 5575 }]
          }
        ];

    const todayStr = new Date().toISOString().split('T')[0];

    const invoicePayload = {
      document: {
        id: config.documentId
      },
      date: todayStr,
      customer: {
        id: customerId
      },
      seller: config.sellerId,
      items: invoiceItems,
      payments: [
        {
          id: paymentId,
          value: order.total,
          due_date: todayStr
        }
      ],
      observations: `Pedido tienda virtual: ${order.order_ref}. Pasarela: ${order.payment_gateway || order.payment_method}`
    };

    console.log('🚀 Enviando Factura a Siigo Nube:', invoicePayload);

    const response = await fetch(`${config.apiUrl}/v1/invoices`, {
      method: 'POST',
      headers,
      body: JSON.stringify(invoicePayload)
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error('❌ Error emitiendo factura en Siigo:', errorDetail);

      // Registrar error en la orden de Supabase para fácil soporte
      await orderService.updateOrder(order.id, {
        siigo_invoice_status: 'failed',
        siigo_error_log: errorDetail.substring(0, 500)
      });

      throw new Error(`Error en Siigo (${response.status}): ${errorDetail}`);
    }

    const invoiceData = await response.json();
    const invoiceId = invoiceData.id;
    const invoiceNumber = invoiceData.name || `FV-${invoiceData.number || invoiceId}`;
    const pdfUrl = invoiceData.public_url || null;

    // 5.4 Actualizar la orden en Supabase con los datos oficiales de Siigo
    await orderService.updateOrder(order.id, {
      siigo_invoice_id: invoiceId,
      siigo_invoice_number: invoiceNumber,
      siigo_invoice_status: 'generated',
      siigo_pdf_url: pdfUrl,
      siigo_error_log: null
    });

    console.log(`✅ Factura emitida con éxito en Siigo: ${invoiceNumber} (ID: ${invoiceId})`);

    return {
      invoiceId,
      invoiceNumber,
      pdfUrl: pdfUrl || undefined
    };
  }
};
