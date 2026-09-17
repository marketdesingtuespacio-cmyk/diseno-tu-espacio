const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/data/realInventory.json');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

let sql = `-- SCRIPT DE POBLACIÓN Y SINCRONIZACIÓN COMPLETA PARA SUPABASE POSTGRESQL\n`;
sql += `-- Copiar todo este código y ejecutar en: Supabase Dashboard -> SQL Editor\n\n`;

sql += `-- 1. Agregar las 7 columnas de inventario a la tabla 'products'\n`;
sql += `ALTER TABLE products \n`;
sql += `ADD COLUMN IF NOT EXISTS sku TEXT,\n`;
sql += `ADD COLUMN IF NOT EXISTS warehouse_stock INT DEFAULT 0,\n`;
sql += `ADD COLUMN IF NOT EXISTS store_stock INT DEFAULT 0,\n`;
sql += `ADD COLUMN IF NOT EXISTS web_stock INT DEFAULT 0,\n`;
sql += `ADD COLUMN IF NOT EXISTS boxes_count INT DEFAULT 0,\n`;
sql += `ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '3 años',\n`;
sql += `ADD COLUMN IF NOT EXISTS inventory_status TEXT DEFAULT 'Disponible';\n\n`;

sql += `-- 2. Crear índice único en slug para permitir ON CONFLICT (slug)\n`;
sql += `CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products(slug);\n\n`;

sql += `-- 3. Insertar / Actualizar los 102 productos con SKU, stock bodega/tienda/web y garantía\n`;

json.forEach((p) => {
  const nameEsc = (p.name || '').replace(/'/g, "''");
  const descEsc = (p.description || '').replace(/'/g, "''");
  const brandEsc = (p.brand_collection || 'Diseño Tu Espacio Collection').replace(/'/g, "''");
  const catEsc = (p.category || '').replace(/'/g, "''");
  const styleEsc = (p.style || '').replace(/'/g, "''");
  const dimEsc = (p.dimensions || '').replace(/'/g, "''");
  const matEsc = (p.materials || '').replace(/'/g, "''");
  const warrantyEsc = (p.warranty || '3 años').replace(/'/g, "''");
  const skuEsc = (p.sku || '').replace(/'/g, "''");
  const statusEsc = (p.inventory_status || 'Disponible').replace(/'/g, "''");
  const imagesJson = JSON.stringify(p.images || []);
  const colorsJson = JSON.stringify(p.colors || []);
  const origPrice = p.original_price ? p.original_price : 'NULL';

  sql += `INSERT INTO products (\n`;
  sql += `  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status\n`;
  sql += `) VALUES (\n`;
  sql += `  '${nameEsc}', '${p.slug}', '${brandEsc}', '${descEsc}', ${p.price}, ${origPrice}, '${catEsc}', '${styleEsc}', ${p.stock}, '${imagesJson}'::jsonb, '${colorsJson}'::jsonb, ${p.is_featured ? 'true' : 'false'}, '${dimEsc}', '${matEsc}', '${skuEsc}', ${p.warehouse_stock || 0}, ${p.store_stock || 0}, ${p.web_stock || 0}, ${p.boxes_count || 0}, '${warrantyEsc}', '${statusEsc}'\n`;
  sql += `)\n`;
  sql += `ON CONFLICT (slug) DO UPDATE SET\n`;
  sql += `  name = EXCLUDED.name,\n`;
  sql += `  sku = EXCLUDED.sku,\n`;
  sql += `  category = EXCLUDED.category,\n`;
  sql += `  price = EXCLUDED.price,\n`;
  sql += `  original_price = EXCLUDED.original_price,\n`;
  sql += `  stock = EXCLUDED.stock,\n`;
  sql += `  warehouse_stock = EXCLUDED.warehouse_stock,\n`;
  sql += `  store_stock = EXCLUDED.store_stock,\n`;
  sql += `  web_stock = EXCLUDED.web_stock,\n`;
  sql += `  boxes_count = EXCLUDED.boxes_count,\n`;
  sql += `  warranty = EXCLUDED.warranty,\n`;
  sql += `  inventory_status = EXCLUDED.inventory_status;\n\n`;
});

const outPath = path.join(__dirname, '../inventarios/sync_all_products_to_supabase.sql');
fs.writeFileSync(outPath, sql);
console.log('SQL sync script generated successfully:', outPath);
