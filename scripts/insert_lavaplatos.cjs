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

// 18 lavaplatos from user sheet
const RAW_LAVAPLATOS = [
  { name: 'Lavaplatos 10046-BLACK', category: 'Lavaplatos', sku: '10046-BLACK', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 850000, iva: 161500, finalPrice: 1011500, finish: 'Negro Mate' },
  { name: 'Lavaplatos 7546C-BLACK', category: 'Lavaplatos', sku: '7546C-BLACK', stock: 2, warehouse: 0, store: 0, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000, finish: 'Negro Mate' },
  { name: 'Lavaplatos 7546C-GOLD', category: 'Lavaplatos', sku: '7546C-GOLD', stock: 20, warehouse: 5, store: 5, web: 10, clientSinIva: 650000, iva: 123500, finalPrice: 773500, finish: 'Dorado Cepillado' },
  { name: 'Lavaplatos 7046A-BLACK', category: 'Lavaplatos', sku: '7046A-BLACK', stock: 20, warehouse: 5, store: 5, web: 10, clientSinIva: 600000, iva: 114000, finalPrice: 714000, finish: 'Negro Mate' },
  { name: 'Lavaplatos 6846C-BLACK', category: 'Lavaplatos', sku: '6846C-BLACK', stock: 20, warehouse: 5, store: 5, web: 10, clientSinIva: 550000, iva: 104500, finalPrice: 654500, finish: 'Negro Mate' },
  { name: 'Lavaplatos 6846C-GOLD', category: 'Lavaplatos', sku: '6846C-GOLD', stock: 20, warehouse: 5, store: 5, web: 10, clientSinIva: 550000, iva: 104500, finalPrice: 654500, finish: 'Dorado Cepillado' },
  { name: 'Lavaplatos 7546E-BLACK', category: 'Lavaplatos', sku: '7546E-BLACK', stock: 20, warehouse: 5, store: 5, web: 10, clientSinIva: 820000, iva: 155800, finalPrice: 975800, finish: 'Negro Mate' },
  { name: 'Lavaplatos 6045A-GOLD', category: 'Lavaplatos', sku: '6045A-GOLD', stock: 5, warehouse: 0, store: 0, web: 5, clientSinIva: 520000, iva: 98800, finalPrice: 618800, finish: 'Dorado Cepillado' },
  { name: 'Lavaplatos 6045B-GOLD', category: 'Lavaplatos', sku: '6045B-GOLD', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 500000, iva: 95000, finalPrice: 595000, finish: 'Dorado Cepillado' },
  { name: 'Lavaplatos 6045A-ROSE', category: 'Lavaplatos', sku: '6045A-ROSE', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 550000, iva: 104500, finalPrice: 654500, finish: 'Oro Rosa / Cobre' },
  { name: 'Lavaplatos 5051A-BLACK', category: 'Lavaplatos', sku: '5051A-BLACK', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 630000, iva: 119700, finalPrice: 749700, finish: 'Negro Mate' },
  { name: 'Lavaplatos 5051A-GOLD', category: 'Lavaplatos', sku: '5051A-GOLD', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 650000, iva: 123500, finalPrice: 773500, finish: 'Dorado Cepillado' },
  { name: 'Lavaplatos 5051A-SATIN', category: 'Lavaplatos', sku: '5051A-SATIN', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 650000, iva: 123500, finalPrice: 773500, finish: 'Acero Satinado' },
  { name: 'Lavaplatos 12050C-BLACK', category: 'Lavaplatos', sku: '12050C-BLACK', stock: 9, warehouse: 1, store: 3, web: 6, clientSinIva: 1150000, iva: 218500, finalPrice: 1368500, finish: 'Negro Mate Doble Pozo' },
  { name: 'Lavaplatos 9045A-BLACK', category: 'Lavaplatos', sku: '9045A-BLACK', stock: 9, warehouse: 1, store: 3, web: 6, clientSinIva: 850000, iva: 161500, finalPrice: 1011500, finish: 'Negro Mate' },
  { name: 'Lavaplatos 8550A-BLACK', category: 'Lavaplatos', sku: '8550A-BLACK', stock: 2, warehouse: 0, store: 0, web: 2, clientSinIva: 750000, iva: 142500, finalPrice: 892500, finish: 'Negro Mate' },
  { name: 'Lavaplatos 6045C-GRAY', category: 'Lavaplatos', sku: '6045C-GRAY', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 500000, iva: 95000, finalPrice: 595000, finish: 'Gris Grafito / Titanio' },
  { name: 'Lavaplatos 5045A-BLACK', category: 'Lavaplatos', sku: '5045A-BLACK', stock: 10, warehouse: 3, store: 2, web: 5, clientSinIva: 500000, iva: 95000, finalPrice: 595000, finish: 'Negro Mate' }
];

async function main() {
  console.log('📦 Iniciando carga de 18 lavaplatos al inventario de Diseño Tu Espacio...');

  // 1. Preparar objetos para Supabase
  const productsToInsert = RAW_LAVAPLATOS.map(item => {
    const cleanSku = item.sku.trim();
    const cleanSlug = `lavaplatos-${cleanSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    // Asignar imagen acorde al acabado
    let mainImg = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000';
    if (cleanSku.includes('GOLD')) {
      mainImg = 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=1000';
    } else if (cleanSku.includes('ROSE') || cleanSku.includes('SATIN') || cleanSku.includes('GRAY')) {
      mainImg = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1000';
    }

    return {
      name: item.name,
      slug: cleanSlug,
      sku: cleanSku,
      category: 'Lavaplatos',
      style: 'Contemporáneo',
      brand_collection: 'Diseño Tu Espacio Kitchen Collection',
      description: `Lavaplatos de cocina arquitectónico ${item.name} (Ref. SKU: ${cleanSku}). Acabado ${item.finish}, acero inoxidable de alta resistencia, recubrimiento antirruido y diseño de vanguardia.`,
      price: item.finalPrice,
      original_price: null,
      wholesale_price: null, // Casilla vacía sin precio al por mayor
      stock: item.stock,
      warehouse_stock: item.warehouse,
      store_stock: item.store,
      web_stock: item.web,
      boxes_count: 1,
      warranty: '5 años',
      inventory_status: item.stock > 0 ? 'Disponible' : 'Bajo Pedido',
      is_featured: false,
      images: [
        mainImg,
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000'
      ],
      colors: [
        { name: item.finish, hex: cleanSku.includes('GOLD') ? '#D4AF37' : (cleanSku.includes('ROSE') ? '#B76E79' : '#1C1C1C') }
      ],
      dimensions: 'Estándar de Cocina',
      materials: 'Acero Inoxidable Quirúrgico SUS304'
    };
  });

  // 2. Insertar en Supabase Nube
  console.log(`🌐 Insertando ${productsToInsert.length} lavaplatos en Supabase...`);
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

  const insertedProducts = await response.json();
  console.log(`✅ ¡${insertedProducts.length} lavaplatos insertados con éxito en Supabase!`);

  // 3. Sincronizar en local src/data/realInventory.json
  const inventoryPath = 'src/data/realInventory.json';
  const localInventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

  insertedProducts.forEach(prod => {
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
      inventory_status: prod.inventory_status || 'Disponible',
      is_featured: false,
      images: prod.images,
      colors: prod.colors || [],
      dimensions: prod.dimensions || 'Estándar de Cocina',
      materials: prod.materials || 'Acero Inoxidable Quirúrgico SUS304',
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
  console.log(`✅ Inventario local ${inventoryPath} actualizado (Total: ${localInventory.length} productos).`);
}

main().catch(console.error);
