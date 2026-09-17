const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/data/realInventory.json');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

let sql = `-- ==========================================================================\n`;
sql += `-- SCRIPT DE MIGRACIÓN Y POBLACIÓN TOTAL DE INVENTARIOS EN SUPABASE\n`;
sql += `-- ==========================================================================\n`;
sql += `-- PASO 1: Ejecuta las siguientes 7 líneas para crear las columnas faltantes.\n`;
sql += `-- PASO 2: Ejecuta el resto del script para actualizar todos los productos.\n\n`;

sql += `-- ==========================================================================\n`;
sql += `-- PASO 1: CREAR LAS 7 COLUMNAS EN LA TABLA 'products'\n`;
sql += `-- ==========================================================================\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS warehouse_stock INT DEFAULT 0;\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS store_stock INT DEFAULT 0;\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS web_stock INT DEFAULT 0;\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS boxes_count INT DEFAULT 0;\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '3 años';\n`;
sql += `ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_status TEXT DEFAULT 'Disponible';\n\n`;

sql += `-- ==========================================================================\n`;
sql += `-- PASO 2: ACTUALIZACIÓN E INSERCIÓN DE LOS 102 PRODUCTOS CON SKU Y STOCKS\n`;
sql += `-- ==========================================================================\n\n`;

json.forEach((p, idx) => {
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

  sql += `-- Producto ${idx + 1}: SKU ${skuEsc} - ${nameEsc}\n`;
  sql += `UPDATE products SET\n`;
  sql += `  name = '${nameEsc}',\n`;
  sql += `  brand_collection = '${brandEsc}',\n`;
  sql += `  description = '${descEsc}',\n`;
  sql += `  price = ${p.price},\n`;
  sql += `  original_price = ${origPrice},\n`;
  sql += `  category = '${catEsc}',\n`;
  sql += `  style = '${styleEsc}',\n`;
  sql += `  stock = ${p.stock},\n`;
  sql += `  images = '${imagesJson}'::jsonb,\n`;
  sql += `  colors = '${colorsJson}'::jsonb,\n`;
  sql += `  is_featured = ${p.is_featured ? 'true' : 'false'},\n`;
  sql += `  dimensions = '${dimEsc}',\n`;
  sql += `  materials = '${matEsc}',\n`;
  sql += `  sku = '${skuEsc}',\n`;
  sql += `  warehouse_stock = ${p.warehouse_stock || 0},\n`;
  sql += `  store_stock = ${p.store_stock || 0},\n`;
  sql += `  web_stock = ${p.web_stock || 0},\n`;
  sql += `  boxes_count = ${p.boxes_count || 0},\n`;
  sql += `  warranty = '${warrantyEsc}',\n`;
  sql += `  inventory_status = '${statusEsc}'\n`;
  sql += `WHERE slug = '${p.slug}';\n\n`;

  sql += `INSERT INTO products (\n`;
  sql += `  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status\n`;
  sql += `)\n`;
  sql += `SELECT\n`;
  sql += `  '${nameEsc}', '${p.slug}', '${brandEsc}', '${descEsc}', ${p.price}, ${origPrice}, '${catEsc}', '${styleEsc}', ${p.stock}, '${imagesJson}'::jsonb, '${colorsJson}'::jsonb, ${p.is_featured ? 'true' : 'false'}, '${dimEsc}', '${matEsc}', '${skuEsc}', ${p.warehouse_stock || 0}, ${p.store_stock || 0}, ${p.web_stock || 0}, ${p.boxes_count || 0}, '${warrantyEsc}', '${statusEsc}'\n`;
  sql += `WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '${p.slug}');\n\n`;
});

const outPath = path.join(__dirname, '../inventarios/sync_all_products_to_supabase.sql');
fs.writeFileSync(outPath, sql);
console.log('SQL sync script regenerated successfully:', outPath);
