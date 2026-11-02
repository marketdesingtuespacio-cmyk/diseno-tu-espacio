// Servicio oficial de integración para Pasarela de Pagos Bold Colombia
// La firma de integridad se genera en el servidor (/api/orders/create, /api/appointments/pay):
// la llave secreta de Bold NUNCA viaja al navegador.

export interface BoldButtonConfig {
  orderId: string;
  amount: number; // Monto en COP (número entero)
  currency: string;
  identityKey: string;
  signature: string;
}

export interface BoldPaymentConfig extends BoldButtonConfig {
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  redirectionUrl?: string;
}

export const boldPaymentService = {
  // Carga e inyecta la etiqueta script oficial de Bold que contiene el src y los atributos data-* en la misma etiqueta
  async launchCheckout(config: BoldPaymentConfig): Promise<void> {
    const amountStr = Math.round(config.amount).toString();
    const redirect = config.redirectionUrl || `${window.location.origin}/checkout?status=success&ref=${config.orderId}`;

    const container = document.getElementById('bold-button-container');
    if (!container) {
      console.warn('Contenedor #bold-button-container no encontrado en el DOM');
      return;
    }

    container.innerHTML = '';

    // Crear la etiqueta <script> única que contiene TANTO el src COMO todos los atributos data-* requeridos por document.currentScript de Bold
    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.setAttribute('data-bold-button', 'dark-L');
    script.setAttribute('data-api-key', config.identityKey);
    script.setAttribute('data-order-id', config.orderId);
    script.setAttribute('data-amount', amountStr);
    script.setAttribute('data-currency', config.currency || 'COP');
    script.setAttribute('data-integrity-signature', config.signature);
    script.setAttribute('data-redirection-url', redirect);
    script.setAttribute('data-description', config.description || `Pedido ${config.orderId}`);
    if (config.customerEmail) {
      script.setAttribute('data-customer-email', config.customerEmail);
    }
    script.async = true;

    container.appendChild(script);

    // Intentar disparar click automático si Bold genera un botón clickable
    setTimeout(() => {
      const boldBtn = container.querySelector('button, [class*="bold"], iframe, a, div') as HTMLElement;
      if (boldBtn) {
        boldBtn.click();
      }
    }, 800);
  },

  // Al volver de Bold el servidor consulta el estado real del pago. Bold puede tardar unos
  // segundos en registrar la transacción, así que se reintenta mientras siga "pending".
  async confirmWithRetry<T extends { status: string }>(url: string, body: object, attempts = 6): Promise<T> {
    let last = { status: 'pending' } as T;
    for (let i = 0; i < attempts; i++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      last = await res.json().catch(() => ({ status: 'error' }));
      if (last.status !== 'pending') return last;
      await new Promise(r => setTimeout(r, 2500));
    }
    return last;
  }
};
