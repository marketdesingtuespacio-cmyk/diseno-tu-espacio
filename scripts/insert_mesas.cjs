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

// 19 tables from user sheet
const RAW_TABLES = [
  { name: 'Mesa AA100052', category: 'Mesas con Base', sku: 'AA100052', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010068', category: 'Mesas con Base', sku: 'AA1010068', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010081', category: 'Mesas con Base', sku: 'AA1010081', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010088', category: 'Mesas con Base', sku: 'AA1010088', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA101009', category: 'Mesas con Base', sku: 'AA101009', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 550000, iva: 104500, finalPrice: 654500 },
  { name: 'Mesa AA1010069', category: 'Mesas con Base', sku: 'AA1010069', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010091-720', category: 'Mesas con Base', sku: 'AA1010091-720', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010091-1100', category: 'Mesas con Base', sku: 'AA1010091-1100', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 650000, iva: 123500, finalPrice: 773500 },
  { name: 'Mesa AA1010085', category: 'Mesas con Base', sku: 'AA1010085', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa A-143', category: 'Mesas con Base', sku: 'A-143', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 450000, iva: 85500, finalPrice: 535500 },
  { name: 'Mesa AA1010086', category: 'Mesas con Base', sku: 'AA1010086', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010087', category: 'Mesas con Base', sku: 'AA1010087', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 450000, iva: 85500, finalPrice: 535500 },
  { name: 'Mesa 11', category: 'Mesas con Base', sku: '11', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa A10019', category: 'Mesas con Base', sku: 'A10019', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 550000, iva: 104500, finalPrice: 654500 },
  { name: 'Mesa AA1010089-500', category: 'Mesas Completas', sku: 'AA1010089-500', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010089-1100', category: 'Mesas Completas', sku: 'AA1010089-1100', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 600000, iva: 114000, finalPrice: 714000 },
  { name: 'Mesa AA1010084-01', category: 'Mesas Completas', sku: 'AA1010084-01', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 880000, iva: 167200, finalPrice: 1047200 },
  { name: 'Mesa AA1010084-02', category: 'Mesas Completas', sku: 'AA1010084-02', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 880000, iva: 167200, finalPrice: 1047200 },
  { name: 'Mesa AA1010089-600', category: 'Mesas Completas', sku: 'AA1010089-600', stock: 6, warehouse: 2, store: 2, web: 2, clientSinIva: 650000, iva: 123500, finalPrice: 773500 }
];

async function main() {
  console.log('📦 Iniciando carga de 19 mesas al inventario de Diseño Tu Espacio...');

  // 1. Preparar objetos para Supabase
  const productsToInsert = RAW_TABLES.map(item => {
    const cleanSku = item.sku.trim();
    const cleanSlug = `mesa-${cleanSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    return {
      name: item.name,
      slug: cleanSlug,
      sku: cleanSku,
      category: item.category,
      style: 'Contemporáneo',
      brand_collection: 'Diseño Tu Espacio Collection',
      description: `Mesa de diseño arquitectónico ${item.name} (Ref. SKU: ${cleanSku}). Acabados de lujo, estructura robusta y estilo contemporáneo.`,
      price: item.finalPrice,
      original_price: null,
      wholesale_price: null, // Casilla vacía sin precio al por mayor
      stock: item.stock,
      warehouse_stock: item.warehouse,
      store_stock: item.store,
      web_stock: item.web,
      boxes_count: 1,
      warranty: '3 años',
      inventory_status: 'Disponible',
      is_featured: false,
      images: [
        '/images/cat_mesa_1787548081162.jpg',
        '/images/cat_mesa_portrait_1787589762766.jpg'
      ],
      colors: [
        { name: 'Nogal Natural', hex: '#6b4423' },
        { name: 'Roble Ahumado', hex: '#403328' },
        { name: 'Mármol Negro', hex: '#1c1c1c' }
      ],
      dimensions: 'Estándar Arquitectónico',
      materials: 'Madera Noble, Piedra y Metal'
    };
  });

  // 2. Insertar en Supabase Nube
  console.log(`🌐 Insertando ${productsToInsert.length} mesas en Supabase...`);
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
  console.log(`✅ ¡${insertedProducts.length} mesas insertadas con éxito en Supabase!`);

  // 3. Sincronizar en local src/data/realInventory.json
  const inventoryPath = 'src/data/realInventory.json';
  const localInventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  
  // Agregar o actualizar los nuevos productos en el inventario local
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
      warranty: prod.warranty || '3 años',
      inventory_status: prod.inventory_status || 'Disponible',
      is_featured: false,
      images: prod.images,
      colors: prod.colors || [],
      dimensions: prod.dimensions || 'Estándar Arquitectónico',
      materials: prod.materials || 'Madera Noble, Piedra y Metal',
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
