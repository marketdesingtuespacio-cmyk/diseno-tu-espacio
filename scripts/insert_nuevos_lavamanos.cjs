const fs = require('fs');

const dotenv = fs.readFileSync('.env', 'utf8');
const urlMatch = dotenv.match(/VITE_SUPABASE_URL=([^\s]+)/);
const keyMatch = dotenv.match(/VITE_SUPABASE_ANON_KEY=([^\s]+)/);

if (!urlMatch || !keyMatch) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];

// 40 nuevos lavamanos desde la imagen del usuario
const RAW_LAVAMANOS = [
  { name: 'Lavamanos 400A-BLACK', sku: '400A-BLACK', stock: 9, warehouse: 3, store: 3, web: 3, isStone: false, finish: 'Negro Mate' },
  { name: 'Lavamanos 400A-ROSE', sku: '400A-ROSE', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavamanos 400A-GOLD', sku: '400A-GOLD', stock: 9, warehouse: 3, store: 3, web: 3, isStone: false, finish: 'Dorado Cepillado' },
  { name: 'Lavamanos 400B-BLACK', sku: '400B-BLACK', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Negro Mate' },
  { name: 'Lavamanos 400B-ROSE', sku: '400B-ROSE', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavamanos 400B-GOLD', sku: '400B-GOLD', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Dorado Cepillado' },
  { name: 'Lavamanos 400C-BLACK', sku: '400C-BLACK', stock: 8, warehouse: 2, store: 2, web: 4, isStone: false, finish: 'Negro Mate' },
  { name: 'Lavamanos 400C-ROSE', sku: '400C-ROSE', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavamanos 400C-GOLD', sku: '400C-GOLD', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Dorado Cepillado' },
  { name: 'Lavamanos 4736A-BLACK', sku: '4736A-BLACK', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Negro Mate' },
  { name: 'Lavamanos 4736A-ROSE', sku: '4736A-ROSE', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavamanos 4736A-GOLD', sku: '4736A-GOLD', stock: 10, warehouse: 2, store: 3, web: 5, isStone: false, finish: 'Dorado Cepillado' },
  { name: 'Lavamanos 4085A-BLACK', sku: '4085A-BLACK', stock: 3, warehouse: 0, store: 0, web: 3, isStone: false, finish: 'Negro Mate' },
  { name: 'Lavamanos 4085A-GOLD', sku: '4085A-GOLD', stock: 2, warehouse: 0, store: 0, web: 2, isStone: false, finish: 'Dorado Cepillado' },
  { name: 'Lavamanos 4085A-ROSE', sku: '4085A-ROSE', stock: 4, warehouse: 0, store: 0, web: 4, isStone: false, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavamanos 4080A-BLACK', sku: '4080A-BLACK', stock: 4, warehouse: 0, store: 0, web: 4, isStone: false, finish: 'Negro Mate' },
  { name: 'Lavamanos 4080A-GOLD', sku: '4080A-GOLD', stock: 4, warehouse: 0, store: 0, web: 4, isStone: false, finish: 'Dorado Cepillado' },
  { name: 'Lavamanos 4080A-ROSE', sku: '4080A-ROSE', stock: 4, warehouse: 0, store: 0, web: 4, isStone: false, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavamanos en Piedra 011-80-03', sku: '011-80-03', stock: 7, warehouse: 2, store: 1, web: 4, isStone: true, finish: 'Piedra Natural Gris' },
  { name: 'Lavamanos en Piedra 011-80-01', sku: '011-80-01', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Natural Mármol Blanco' },
  { name: 'Lavamanos en Piedra 010-60--03', sku: '010-60--03', stock: 4, warehouse: 1, store: 1, web: 2, isStone: true, finish: 'Piedra Natural Antracita' },
  { name: 'Lavamanos en Piedra 008-60-70', sku: '008-60-70', stock: 9, warehouse: 3, store: 3, web: 3, isStone: true, finish: 'Piedra Natural Travertino' },
  { name: 'Lavamanos en Piedra 008-100-70', sku: '008-100-70', stock: 9, warehouse: 3, store: 3, web: 3, isStone: true, finish: 'Piedra Natural Travertino' },
  { name: 'Lavamanos en Piedra 077-60-112', sku: '077-60-112', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Esculpida Gris Oxford' },
  { name: 'Lavamanos en Piedra 077-80-112', sku: '077-80-112', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Esculpida Gris Oxford' },
  { name: 'Lavamanos en Piedra M11-60', sku: 'M11-60', stock: 5, warehouse: 0, store: 0, web: 5, isStone: true, finish: 'Mármol Escultural' },
  { name: 'Lavamanos en Piedra A01-80', sku: 'A01-80', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Natural Caliza' },
  { name: 'Lavamanos en Piedra 090-60-72', sku: '090-60-72', stock: 5, warehouse: 0, store: 0, web: 5, isStone: true, finish: 'Piedra Natural Ébano' },
  { name: 'Lavamanos en Piedra A22-80', sku: 'A22-80', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Mármol y Piedra Arquitectónica' },
  { name: 'Lavamanos en Piedra A17-80', sku: 'A17-80', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Arenisca Natural' },
  { name: 'Lavamanos en Piedra M06-80', sku: 'M06-80', stock: 5, warehouse: 0, store: 0, web: 5, isStone: true, finish: 'Mármol Natural Pulido' },
  { name: 'Lavamanos en Piedra M13-80', sku: 'M13-80', stock: 5, warehouse: 0, store: 0, web: 5, isStone: true, finish: 'Mármol Negro Veteado' },
  { name: 'Lavamanos en Piedra 089-60-63', sku: '089-60-63', stock: 4, warehouse: 0, store: 0, web: 4, isStone: true, finish: 'Piedra Basalto Natural' },
  { name: 'Lavamanos en Piedra 026-80-08+90', sku: '026-80-08+90', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Texturizada' },
  { name: 'Lavamanos en Piedra 041-60-83', sku: '041-60-83', stock: 8, warehouse: 2, store: 2, web: 4, isStone: true, finish: 'Piedra Natural Crema' },
  { name: 'Lavamanos en Piedra 064-60-102', sku: '064-60-102', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Grafito Esculpida' },
  { name: 'Lavamanos en Piedra 063-60-36', sku: '063-60-36', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Monolítica' },
  { name: 'Lavamanos en Piedra 006-60-01', sku: '006-60-01', stock: 5, warehouse: 0, store: 0, web: 5, isStone: true, finish: 'Piedra Caliza Blanca' },
  { name: 'Lavamanos en Piedra 005-60-45', sku: '005-60-45', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Río Texturizada' },
  { name: 'Lavamanos en Piedra 068-60-01', sku: '068-60-01', stock: 10, warehouse: 2, store: 3, web: 5, isStone: true, finish: 'Piedra Mármol Gris' }
];

async function main() {
  console.log(`📦 Preparando ${RAW_LAVAMANOS.length} lavamanos para ingreso en modo Privado...`);

  // Imágenes de catálogo de alta resolución
  const imgCeramicBlack = 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A691CBKUG04M_1.jpg';
  const imgCeramicGold = 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A544GGCBK18_1.jpg';
  const imgCeramicRose = 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A787P45M_1.jpg';
  const imgStone = 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Travertine_Flexible_Stone_Panel_Travertine_-3_Travertine-Flexible-Stone-Panel-_Travertine_-3_1791489832647.jpeg';

  const productsToInsert = RAW_LAVAMANOS.map(item => {
    const cleanSku = item.sku.trim();
    const cleanSlug = `lavamanos-${cleanSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    let mainImg = imgCeramicBlack;
    if (item.isStone) {
      mainImg = imgStone;
    } else if (cleanSku.includes('GOLD')) {
      mainImg = imgCeramicGold;
    } else if (cleanSku.includes('ROSE')) {
      mainImg = imgCeramicRose;
    }

    return {
      name: item.name,
      slug: cleanSlug,
      sku: cleanSku,
      category: 'Lavamanos',
      style: item.isStone ? 'Orgánico Moderno' : 'Contemporáneo',
      brand_collection: 'Diseño Tu Espacio Bath Collection',
      description: `${item.name} (Ref. SKU: ${cleanSku}). Acabado ${item.finish}. ${item.isStone ? 'Pieza escultórica tallada en piedra arquitectónica con alta durabilidad y textura táctil exclusiva.' : 'Lavamanos de sobreponer en cerámica vitrificada de alta densidad y acabado contemporáneo.'}`,
      price: 0, // Pendiente de asignación comercial
      original_price: null,
      wholesale_price: null,
      stock: item.stock,
      warehouse_stock: item.warehouse,
      store_stock: item.store,
      web_stock: item.web,
      boxes_count: 1,
      warranty: '5 años',
      inventory_status: 'Privado', // COMO PRIVADOS (SOLICITUD EXPRESA)
      is_featured: false,
      images: [],
      colors: [
        { 
          name: item.finish, 
          hex: cleanSku.includes('GOLD') ? '#D4AF37' : (cleanSku.includes('ROSE') ? '#B76E79' : (item.isStone ? '#78716C' : '#1C1C1C')) 
        }
      ],
      dimensions: item.isStone ? 'Diseño Escultural en Piedra' : 'Estándar Sobreponer',
      materials: item.isStone ? 'Piedra Natural y Mármol Arquitectónico' : 'Cerámica Vitrificada de Alta Densidad'
    };
  });

  console.log(`🌐 Insertando ${productsToInsert.length} productos en Supabase Nube...`);
  const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(productsToInsert)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('❌ Error al insertar en Supabase:', response.status, errText);
    process.exit(1);
  }

  const inserted = await response.json();
  console.log(`✅ ¡${inserted.length} lavamanos creados exitosamente en Supabase Nube!`);

  // Sincronizar en src/data/realInventory.json
  const inventoryPath = 'src/data/realInventory.json';
  const localInventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

  inserted.forEach(prod => {
    const existingIndex = localInventory.findIndex(p => p.sku === prod.sku);
    const itemToSave = {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      brand_collection: prod.brand_collection,
      category: prod.category,
      style: prod.style,
      price: prod.price,
      original_price: null,
      stock: prod.stock,
      warehouse_stock: prod.warehouse_stock,
      store_stock: prod.store_stock,
      web_stock: prod.web_stock,
      boxes_count: prod.boxes_count || 1,
      warranty: prod.warranty || '5 años',
      inventory_status: 'Privado',
      is_featured: false,
      images: prod.images,
      colors: prod.colors || [],
      dimensions: prod.dimensions || 'Estándar',
      materials: prod.materials || 'Material Arquitectónico',
      description: prod.description,
      created_at: prod.created_at,
      wholesale_price: null,
      wholesale_min_qty: 5
    };

    if (existingIndex >= 0) {
      localInventory[existingIndex] = itemToSave;
    } else {
      localInventory.push(itemToSave);
    }
  });

  fs.writeFileSync(inventoryPath, JSON.stringify(localInventory, null, 2), 'utf8');
  console.log(`✅ Archivo ${inventoryPath} actualizado (Total: ${localInventory.length} productos).`);
}

main().catch(console.error);
