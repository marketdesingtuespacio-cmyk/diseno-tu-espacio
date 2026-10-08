// Servicio oficial de integración para Pasarela de Pagos Bold Colombia

export interface BoldPaymentConfig {
  orderId: string;
  amount: number; // Monto en COP (número entero)
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  redirectionUrl?: string;
}

export const boldPaymentService = {
  // Obtiene las llaves activas detectando automáticamente el dominio (localhost / cloudflare pages vs producción)
  getKeys() {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    // Si estamos en localhost o en dominio de prueba de Cloudflare (*.pages.dev), usar ambiente de prueba
    const isTestDomain = hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('pages.dev');

    const forcedEnv = import.meta.env.VITE_BOLD_ENVIRONMENT;
    const environment = forcedEnv ? forcedEnv : (isTestDomain ? 'test' : 'production');

    if (environment === 'test') {
      return {
        environment: 'test',
        identityKey: import.meta.env.VITE_BOLD_IDENTITY_KEY_TEST || '-LQUaNJojK4vuLfW1IF7pA3M8lH2wXdVSLdO0sNObOM',
        secretKey: import.meta.env.VITE_BOLD_SECRET_KEY_TEST || '1eyqeEDNwMMrSO1eaWLxzA'
      };
    }

    return {
      environment: 'production',
      identityKey: import.meta.env.VITE_BOLD_IDENTITY_KEY_PROD || 'NkEEf-txN7jPrz74sRkAW7jigqa39uSuSCmYPv-MoXI',
      secretKey: import.meta.env.VITE_BOLD_SECRET_KEY_PROD || 'VSlSWCrKwBrDO9xDRAF6Kw'
    };
  },

  // Genera la firma de integridad SHA-256 requerida por Bold
  // Fórmula oficial Bold: SHA256(orderId + amount + currency + secretKey)
  async generateIntegritySignature(orderId: string, amount: number, currency: string = 'COP'): Promise<string> {
    const { secretKey } = this.getKeys();
    const amountStr = Math.round(amount).toString();
    const rawString = `${orderId}${amountStr}${currency}${secretKey}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Carga e inyecta la etiqueta script oficial de Bold que contiene el src y los atributos data-* en la misma etiqueta
  async launchCheckout(config: BoldPaymentConfig): Promise<void> {
    const { identityKey, environment } = this.getKeys();
    const currency = 'COP';
    const amountStr = Math.round(config.amount).toString();
    const signature = await this.generateIntegritySignature(config.orderId, config.amount, currency);
    const redirect = config.redirectionUrl || `${window.location.origin}/checkout?status=success&ref=${config.orderId}`;

    console.log(`🚀 Montando Botón Oficial de Bold (${environment.toUpperCase()}):`, {
      identityKey: identityKey.substring(0, 8) + '...',
      orderId: config.orderId,
      amount: amountStr,
      currency,
      signature
    });

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
    script.setAttribute('data-api-key', identityKey);
    script.setAttribute('data-order-id', config.orderId);
    script.setAttribute('data-amount', amountStr);
    script.setAttribute('data-currency', currency);
    script.setAttribute('data-integrity-signature', signature);
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
        console.log('✅ Click automático en botón de Bold...');
        boldBtn.click();
      }
    }, 800);
  }
};
