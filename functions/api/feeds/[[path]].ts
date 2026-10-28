// Cloudflare Pages Function: Generador dinámico de Feeds para Google Shopping y Meta Business
// Permite que Google Merchant Center y Meta Commerce Manager obtengan el catálogo en tiempo real con 1 sola URL.

const SUPABASE_URL = 'https://ukvoqxsmrpicnpelkhex.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdm9xeHNtcnBpY25wZWxraGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMzM0MzEsImV4cCI6MjEwNjkwOTQzMX0.fOnUmdRWE4p0uL8ZCd0o_HLHtCHOVE13jsEpNHJ0L-M';

const mapGoogleCategory = (cat: string = '') => {
  const c = cat.toLowerCase();
  if (c.includes('espejo')) return 'Home & Garden > Decor > Mirrors';
  if (c.includes('cuadro') || c.includes('arte')) return 'Home & Garden > Decor > Artwork > Posters, Prints, & Visual Artwork';
  if (c.includes('lavamano') || c.includes('griferia')) return 'Hardware > Plumbing > Plumbing Fixtures > Sinks > Bathroom Sinks';
  if (c.includes('papel') || c.includes('revestimiento') || c.includes('panel')) return 'Home & Garden > Decor > Wallpaper';
  if (c.includes('lampara') || c.includes('iluminac')) return 'Home & Garden > Lighting > Lamps';
  if (c.includes('mueble') || c.includes('mesa') || c.includes('silla')) return 'Furniture';
  return 'Home & Garden > Decor';
};

const escapeXml = (unsafe: string = '') => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const escapeCsv = (val: any = '') => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

export async function onRequest(context: any) {
  const { request, params } = context;
  const url = new URL(request.url);
  const siteUrl = `${url.protocol}//${url.host}`;

  const path = Array.isArray(params.path) ? params.path.join('/') : (params.path || '');
  const isCsv = path.endsWith('.csv') || url.searchParams.get('format') === 'csv';

  try {
    // 1. Obtener productos directamente desde Supabase REST API
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!resp.ok) {
      throw new Error(`Error en consulta a Supabase: ${resp.statusText}`);
    }

    const rawProducts = await resp.json() as any[];
    const validProducts = (rawProducts || []).filter(p => p.name && Number(p.price) > 0);

    // --- RESPUESTA EN FORMATO CSV PARA META CATALOG ---
    if (isCsv) {
      const csvHeaders = [
        'id',
        'title',
        'description',
        'availability',
        'condition',
        'price',
        'link',
        'image_link',
        'brand',
        'google_product_category',
        'fb_product_category'
      ];

      const csvRows = [csvHeaders.join(',')];

      for (const p of validProducts) {
        const id = p.sku || p.id;
        const title = p.name;
        const description = p.description || `${p.name} - Acabados de lujo exclusivo de Diseño Tu Espacio.`;
        const slug = p.slug || p.id;
        const link = `${siteUrl}/product/${slug}`;

        let primaryImage = '';
        if (Array.isArray(p.images) && p.images.length > 0) {
          primaryImage = p.images[0];
        } else if (typeof p.images === 'string') {
          primaryImage = p.images;
        }
        if (!primaryImage) {
          primaryImage = `${siteUrl}/images/cat_mesa_1787548081162.jpg`;
        } else if (primaryImage.startsWith('/')) {
          primaryImage = `${siteUrl}${primaryImage}`;
        }

        const priceCop = `${Math.round(Number(p.price))} COP`;
        const availability = (p.stock > 0 && p.inventory_status !== 'Agotado') ? 'in stock' : 'out of stock';
        const googleCat = mapGoogleCategory(p.category);
        const brand = p.brand_collection || 'Diseño Tu Espacio';

        csvRows.push([
          escapeCsv(id),
          escapeCsv(title),
          escapeCsv(description),
          escapeCsv(availability),
          escapeCsv('new'),
          escapeCsv(priceCop),
          escapeCsv(link),
          escapeCsv(primaryImage),
          escapeCsv(brand),
          escapeCsv(googleCat),
          escapeCsv(googleCat)
        ].join(','));
      }

      return new Response(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // --- RESPUESTA EN FORMATO XML PARA GOOGLE SHOPPING Y META BUSINESS ---
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Diseño Tu Espacio - Catálogo Oficial</title>
    <link>${siteUrl}</link>
    <description>Catálogo de Mobiliario, Espejos de Autor, Cuadros, Lavamanos y Diseño de Interiores</description>
`;

    for (const p of validProducts) {
      const id = p.sku || p.id;
      const title = p.name;
      const description = p.description || `${p.name} - Acabados de lujo y diseño contemporáneo exclusivo de Diseño Tu Espacio.`;
      const slug = p.slug || p.id;
      const link = `${siteUrl}/product/${slug}`;

      let primaryImage = '';
      let additionalImages: string[] = [];
      if (Array.isArray(p.images) && p.images.length > 0) {
        primaryImage = p.images[0];
        additionalImages = p.images.slice(1, 10);
      } else if (typeof p.images === 'string') {
        primaryImage = p.images;
      }
      if (!primaryImage) {
        primaryImage = `${siteUrl}/images/cat_mesa_1787548081162.jpg`;
      } else if (primaryImage.startsWith('/')) {
        primaryImage = `${siteUrl}${primaryImage}`;
      }

      const priceCop = `${Math.round(Number(p.price))} COP`;
      const availability = (p.stock > 0 && p.inventory_status !== 'Agotado') ? 'in_stock' : 'out_of_stock';
      const googleCat = mapGoogleCategory(p.category);
      const brand = p.brand_collection || 'Diseño Tu Espacio';

      xml += `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
`;

      for (const addImg of additionalImages) {
        const fullImg = addImg.startsWith('/') ? `${siteUrl}${addImg}` : addImg;
        xml += `      <g:additional_image_link>${escapeXml(fullImg)}</g:additional_image_link>\n`;
      }

      xml += `      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${priceCop}</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:google_product_category>${escapeXml(googleCat)}</g:google_product_category>
      <g:product_type>${escapeXml(p.category || 'Hogar & Decoración')}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;
    }

    xml += `  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
