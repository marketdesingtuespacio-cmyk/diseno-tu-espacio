const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno
let supabaseUrl = 'https://ukvoqxsmrpicnpelkhex.supabase.co';
let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdm9xeHNtcnBpY25wZWxraGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMzM0MzEsImV4cCI6MjEwNjkwOTQzMX0.fOnUmdRWE4p0uL8ZCd0o_HLHtCHOVE13jsEpNHJ0L-M';

try {
  if (fs.existsSync('.env')) {
    const env = fs.readFileSync('.env', 'utf8');
    const u = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
    const k = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
    if (u) supabaseUrl = u;
    if (k) supabaseKey = k;
  }
} catch (e) {}

const SITE_URL = process.env.VITE_SITE_URL || 'https://disenotuespacio.com';

const mapGoogleCategory = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('espejo')) return 'Home & Garden > Decor > Mirrors';
  if (c.includes('cuadro') || c.includes('arte')) return 'Home & Garden > Decor > Artwork > Posters, Prints, & Visual Artwork';
  if (c.includes('lavamano') || c.includes('griferia')) return 'Hardware > Plumbing > Plumbing Fixtures > Sinks > Bathroom Sinks';
  if (c.includes('papel') || c.includes('revestimiento') || c.includes('panel')) return 'Home & Garden > Decor > Wallpaper';
  if (c.includes('lampara') || c.includes('iluminac')) return 'Home & Garden > Lighting > Lamps';
  if (c.includes('mueble') || c.includes('mesa') || c.includes('silla')) return 'Furniture';
  return 'Home & Garden > Decor';
};

const escapeXml = (unsafe = '') => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const escapeCsv = (val = '') => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

async function buildFeeds() {
  console.log('🚀 Iniciando generación de Feeds de Productos para Meta y Google Shopping...');

  let products = [];

  // 1. Intentar consultar Supabase
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data && data.length > 0) {
      products = data;
      console.log(`✓ Obtenidos ${products.length} productos desde Supabase Nube.`);
    }
  } catch (err) {
    console.warn('No se pudo conectar a Supabase, usando catálogo local:', err.message);
  }

  // Fallback a realInventory.json si Supabase no responde
  if (products.length === 0) {
    const invPath = path.join(__dirname, '../src/data/realInventory.json');
    if (fs.existsSync(invPath)) {
      products = JSON.parse(fs.readFileSync(invPath, 'utf8'));
      console.log(`✓ Obtenidos ${products.length} productos desde realInventory.json.`);
    }
  }

  // Filtrar productos válidos (con nombre y precio)
  const validProducts = products.filter(p => p.name && Number(p.price) > 0);
  console.log(`📦 Procesando ${validProducts.length} productos válidos para el feed...`);

  // Asegurar directorio public/feeds
  const feedsDir = path.join(__dirname, '../public/feeds');
  if (!fs.existsSync(feedsDir)) {
    fs.mkdirSync(feedsDir, { recursive: true });
  }

  // --- 1. GENERAR GOOGLE SHOPPING XML (Compatible 100% con Google Merchant Center y Meta Business) ---
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Diseño Tu Espacio - Catálogo Oficial</title>
    <link>${SITE_URL}</link>
    <description>Catálogo de Mobiliario, Espejos de Autor, Cuadros, Lavamanos y Diseño de Interiores</description>
`;

  for (const p of validProducts) {
    const id = p.sku || p.id;
    const title = p.name;
    const description = p.description || `${p.name} - Acabados de lujo y diseño contemporáneo exclusivo de Diseño Tu Espacio.`;
    const slug = p.slug || p.id;
    const link = `${SITE_URL}/product/${slug}`;
    
    // Obtener imagen principal
    let primaryImage = '';
    let additionalImages = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      primaryImage = p.images[0];
      additionalImages = p.images.slice(1, 10);
    } else if (typeof p.images === 'string') {
      primaryImage = p.images;
    }
    if (!primaryImage) {
      primaryImage = `${SITE_URL}/images/cat_mesa_1787548081162.jpg`;
    } else if (primaryImage.startsWith('/')) {
      primaryImage = `${SITE_URL}${primaryImage}`;
    }

    const priceCop = `${Math.round(Number(p.price))} COP`;
    const availability = (p.stock > 0 && p.inventory_status !== 'Agotado') ? 'in_stock' : 'out_of_stock';
    const googleCategory = mapGoogleCategory(p.category);
    const brand = p.brand_collection || 'Diseño Tu Espacio';

    xml += `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
`;

    for (const addImg of additionalImages) {
      const fullAddImg = addImg.startsWith('/') ? `${SITE_URL}${addImg}` : addImg;
      xml += `      <g:additional_image_link>${escapeXml(fullAddImg)}</g:additional_image_link>\n`;
    }

    xml += `      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${priceCop}</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(p.category || 'Hogar & Decoración')}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  const xmlPath = path.join(feedsDir, 'google-shopping.xml');
  fs.writeFileSync(xmlPath, xml, 'utf8');
  console.log(`✓ Archivo XML generado: public/feeds/google-shopping.xml (${(Buffer.byteLength(xml) / 1024).toFixed(1)} KB)`);

  // --- 2. GENERAR META BUSINESS CSV (Facebook & Instagram Catalog) ---
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

  let csvRows = [csvHeaders.join(',')];

  for (const p of validProducts) {
    const id = p.sku || p.id;
    const title = p.name;
    const description = p.description || `${p.name} - Acabados de lujo exclusivo de Diseño Tu Espacio.`;
    const slug = p.slug || p.id;
    const link = `${SITE_URL}/product/${slug}`;
    
    let primaryImage = '';
    if (Array.isArray(p.images) && p.images.length > 0) {
      primaryImage = p.images[0];
    } else if (typeof p.images === 'string') {
      primaryImage = p.images;
    }
    if (!primaryImage) {
      primaryImage = `${SITE_URL}/images/cat_mesa_1787548081162.jpg`;
    } else if (primaryImage.startsWith('/')) {
      primaryImage = `${SITE_URL}${primaryImage}`;
    }

    const priceCop = `${Math.round(Number(p.price))} COP`;
    const availability = (p.stock > 0 && p.inventory_status !== 'Agotado') ? 'in stock' : 'out of stock';
    const googleCategory = mapGoogleCategory(p.category);
    const brand = p.brand_collection || 'Diseño Tu Espacio';

    const row = [
      escapeCsv(id),
      escapeCsv(title),
      escapeCsv(description),
      escapeCsv(availability),
      escapeCsv('new'),
      escapeCsv(priceCop),
      escapeCsv(link),
      escapeCsv(primaryImage),
      escapeCsv(brand),
      escapeCsv(googleCategory),
      escapeCsv(googleCategory)
    ];

    csvRows.push(row.join(','));
  }

  const csvContent = csvRows.join('\n');
  const csvPath = path.join(feedsDir, 'meta-catalog.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✓ Archivo CSV generado: public/feeds/meta-catalog.csv (${(Buffer.byteLength(csvContent) / 1024).toFixed(1)} KB)`);

  console.log(`\n🎉 ¡Feeds generados exitosamente! Ambos están listos en /public/feeds/`);
}

buildFeeds().catch(err => {
  console.error('Error generando feeds:', err);
  process.exit(1);
});
