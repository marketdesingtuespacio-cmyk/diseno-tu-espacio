// Cloudflare Pages Function: Proxy para Siigo API
// Permite que las llamadas desde el navegador se comuniquen con api.siigo.com sin bloqueo de CORS

export async function onRequest(context: any) {
  const { request, params } = context;

  // Manejo de preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Partner-Id, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
  const url = new URL(request.url);
  const targetUrl = `https://api.siigo.com/${path}${url.search}`;

  const forwardHeaders = new Headers();
  forwardHeaders.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
  if (request.headers.get('Authorization')) {
    forwardHeaders.set('Authorization', request.headers.get('Authorization')!);
  }
  if (request.headers.get('Partner-Id')) {
    forwardHeaders.set('Partner-Id', request.headers.get('Partner-Id')!);
  }

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: forwardHeaders,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.text();
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseBody = await response.text();

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Partner-Id');
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'application/json');

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Error en proxy Siigo' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
