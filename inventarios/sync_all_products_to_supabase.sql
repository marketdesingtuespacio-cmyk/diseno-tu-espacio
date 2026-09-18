-- ==========================================================================
-- SCRIPT DE MIGRACIÓN Y POBLACIÓN TOTAL DE INVENTARIOS EN SUPABASE
-- ==========================================================================
-- PASO 1: Ejecuta las siguientes 7 líneas para asegurar las columnas.
-- PASO 2: Ejecuta el resto del script para actualizar todos los productos.

-- ==========================================================================
-- PASO 1: CREAR LAS 7 COLUMNAS EN LA TABLA 'products'
-- ==========================================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warehouse_stock INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_stock INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS web_stock INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS boxes_count INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '3 años';
ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_status TEXT DEFAULT 'Disponible';

-- ==========================================================================
-- PASO 2: ACTUALIZACIÓN E INSERCIÓN DE LOS 102 PRODUCTOS CON SKU Y STOCKS
-- ==========================================================================

-- Producto 1: SKU MD680101 - Papel de colgadura MD680101
UPDATE products SET
  name = 'Papel de colgadura MD680101',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680101 referencia SKU MD680101. Acabados de lujo y garantía de 4 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 80,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680101',
  warehouse_stock = 40,
  store_stock = 35,
  web_stock = 5,
  boxes_count = 8,
  warranty = '4 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-1-md680101';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680101', 'prod-1-md680101', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680101 referencia SKU MD680101. Acabados de lujo y garantía de 4 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 80, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680101', 40, 35, 5, 8, '4 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-1-md680101');

-- Producto 2: SKU MD680209 - Papel de colgadura MD680209
UPDATE products SET
  name = 'Papel de colgadura MD680209',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680209 referencia SKU MD680209. Acabados de lujo y garantía de 5 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 86,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680209',
  warehouse_stock = 40,
  store_stock = 40,
  web_stock = 6,
  boxes_count = 9,
  warranty = '5 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-2-md680209';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680209', 'prod-2-md680209', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680209 referencia SKU MD680209. Acabados de lujo y garantía de 5 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 86, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680209', 40, 40, 6, 9, '5 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-2-md680209');

-- Producto 3: SKU MD680301 - Papel de colgadura MD680301
UPDATE products SET
  name = 'Papel de colgadura MD680301',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680301 referencia SKU MD680301. Acabados de lujo y garantía de 6 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 79,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680301',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 9,
  boxes_count = 8,
  warranty = '6 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-3-md680301';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680301', 'prod-3-md680301', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680301 referencia SKU MD680301. Acabados de lujo y garantía de 6 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 79, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680301', 40, 30, 9, 8, '6 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-3-md680301');

-- Producto 4: SKU MD680313 - Papel de colgadura MD680313
UPDATE products SET
  name = 'Papel de colgadura MD680313',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680313 referencia SKU MD680313. Acabados de lujo y garantía de 7 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 79,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680313',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 9,
  boxes_count = 8,
  warranty = '7 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-4-md680313';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680313', 'prod-4-md680313', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680313 referencia SKU MD680313. Acabados de lujo y garantía de 7 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 79, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680313', 40, 30, 9, 8, '7 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-4-md680313');

-- Producto 5: SKU MD680312 - Papel de colgadura MD680312
UPDATE products SET
  name = 'Papel de colgadura MD680312',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680312 referencia SKU MD680312. Acabados de lujo y garantía de 8 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 82,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680312',
  warehouse_stock = 40,
  store_stock = 40,
  web_stock = 2,
  boxes_count = 9,
  warranty = '8 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-5-md680312';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680312', 'prod-5-md680312', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680312 referencia SKU MD680312. Acabados de lujo y garantía de 8 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 82, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680312', 40, 40, 2, 9, '8 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-5-md680312');

-- Producto 6: SKU MD680402B - Papel de colgadura MD680402B
UPDATE products SET
  name = 'Papel de colgadura MD680402B',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680402B referencia SKU MD680402B. Acabados de lujo y garantía de 9 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 78,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680402B',
  warehouse_stock = 30,
  store_stock = 40,
  web_stock = 8,
  boxes_count = 8,
  warranty = '9 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-6-md680402b';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680402B', 'prod-6-md680402b', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680402B referencia SKU MD680402B. Acabados de lujo y garantía de 9 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 78, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680402B', 30, 40, 8, 8, '9 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-6-md680402b');

-- Producto 7: SKU MD680510-B - Papel de colgadura MD680510-B
UPDATE products SET
  name = 'Papel de colgadura MD680510-B',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680510-B referencia SKU MD680510-B. Acabados de lujo y garantía de 10 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 94,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680510-B',
  warehouse_stock = 50,
  store_stock = 40,
  web_stock = 4,
  boxes_count = 10,
  warranty = '10 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-7-md680510b';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680510-B', 'prod-7-md680510b', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680510-B referencia SKU MD680510-B. Acabados de lujo y garantía de 10 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 94, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680510-B', 50, 40, 4, 10, '10 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-7-md680510b');

-- Producto 8: SKU MD680512-B - Papel de colgadura MD680512-B
UPDATE products SET
  name = 'Papel de colgadura MD680512-B',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680512-B referencia SKU MD680512-B. Acabados de lujo y garantía de 11 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 70,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680512-B',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 5,
  boxes_count = 7,
  warranty = '11 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-8-md680512b';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680512-B', 'prod-8-md680512b', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680512-B referencia SKU MD680512-B. Acabados de lujo y garantía de 11 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 70, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680512-B', 40, 30, 5, 7, '11 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-8-md680512b');

-- Producto 9: SKU MD680603 - Papel de colgadura MD680603
UPDATE products SET
  name = 'Papel de colgadura MD680603',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680603 referencia SKU MD680603. Acabados de lujo y garantía de 12 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 74,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680603',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 4,
  boxes_count = 8,
  warranty = '12 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-9-md680603';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680603', 'prod-9-md680603', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680603 referencia SKU MD680603. Acabados de lujo y garantía de 12 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 74, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680603', 40, 30, 4, 8, '12 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-9-md680603');

-- Producto 10: SKU MD680704 - Papel de colgadura MD680704
UPDATE products SET
  name = 'Papel de colgadura MD680704',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680704 referencia SKU MD680704. Acabados de lujo y garantía de 13 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 0,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680704',
  warehouse_stock = 0,
  store_stock = 0,
  web_stock = 0,
  boxes_count = 1,
  warranty = '13 años',
  inventory_status = 'Agotado'
WHERE slug = 'prod-10-md680704';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680704', 'prod-10-md680704', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680704 referencia SKU MD680704. Acabados de lujo y garantía de 13 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 0, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680704', 0, 0, 0, 1, '13 años', 'Agotado'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-10-md680704');

-- Producto 11: SKU MD680904 - Papel de colgadura MD680904
UPDATE products SET
  name = 'Papel de colgadura MD680904',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680904 referencia SKU MD680904. Acabados de lujo y garantía de 14 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 65,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680904',
  warehouse_stock = 30,
  store_stock = 30,
  web_stock = 5,
  boxes_count = 7,
  warranty = '14 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-11-md680904';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680904', 'prod-11-md680904', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680904 referencia SKU MD680904. Acabados de lujo y garantía de 14 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 65, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680904', 30, 30, 5, 7, '14 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-11-md680904');

-- Producto 12: SKU MD681014 - Papel de colgadura MD681014
UPDATE products SET
  name = 'Papel de colgadura MD681014',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681014 referencia SKU MD681014. Acabados de lujo y garantía de 15 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 71,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681014',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 1,
  boxes_count = 8,
  warranty = '15 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-12-md681014';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681014', 'prod-12-md681014', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681014 referencia SKU MD681014. Acabados de lujo y garantía de 15 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 71, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681014', 40, 30, 1, 8, '15 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-12-md681014');

-- Producto 13: SKU MD681113 - Papel de colgadura MD681113
UPDATE products SET
  name = 'Papel de colgadura MD681113',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681113 referencia SKU MD681113. Acabados de lujo y garantía de 16 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 71,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681113',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 1,
  boxes_count = 8,
  warranty = '16 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-13-md681113';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681113', 'prod-13-md681113', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681113 referencia SKU MD681113. Acabados de lujo y garantía de 16 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 71, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681113', 40, 30, 1, 8, '16 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-13-md681113');

-- Producto 14: SKU MD681209 - Papel de colgadura MD681209
UPDATE products SET
  name = 'Papel de colgadura MD681209',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681209 referencia SKU MD681209. Acabados de lujo y garantía de 17 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 75,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681209',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 5,
  boxes_count = 8,
  warranty = '17 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-14-md681209';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681209', 'prod-14-md681209', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681209 referencia SKU MD681209. Acabados de lujo y garantía de 17 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 75, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681209', 40, 30, 5, 8, '17 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-14-md681209');

-- Producto 15: SKU MD681309 - Papel de colgadura MD681309
UPDATE products SET
  name = 'Papel de colgadura MD681309',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681309 referencia SKU MD681309. Acabados de lujo y garantía de 18 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 75,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681309',
  warehouse_stock = 40,
  store_stock = 30,
  web_stock = 5,
  boxes_count = 8,
  warranty = '18 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-15-md681309';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681309', 'prod-15-md681309', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681309 referencia SKU MD681309. Acabados de lujo y garantía de 18 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 75, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681309', 40, 30, 5, 8, '18 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-15-md681309');

-- Producto 16: SKU MD681412 - Papel de colgadura MD681412
UPDATE products SET
  name = 'Papel de colgadura MD681412',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681412 referencia SKU MD681412. Acabados de lujo y garantía de 19 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 86,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681412',
  warehouse_stock = 40,
  store_stock = 40,
  web_stock = 6,
  boxes_count = 9,
  warranty = '19 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-16-md681412';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681412', 'prod-16-md681412', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681412 referencia SKU MD681412. Acabados de lujo y garantía de 19 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 86, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681412', 40, 40, 6, 9, '19 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-16-md681412');

-- Producto 17: SKU MD681511 - Papel de colgadura MD681511
UPDATE products SET
  name = 'Papel de colgadura MD681511',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681511 referencia SKU MD681511. Acabados de lujo y garantía de 20 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 84,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681511',
  warehouse_stock = 40,
  store_stock = 40,
  web_stock = 4,
  boxes_count = 9,
  warranty = '20 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-17-md681511';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681511', 'prod-17-md681511', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681511 referencia SKU MD681511. Acabados de lujo y garantía de 20 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 84, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681511', 40, 40, 4, 9, '20 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-17-md681511');

-- Producto 18: SKU MD681706 - Papel de colgadura MD681706
UPDATE products SET
  name = 'Papel de colgadura MD681706',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681706 referencia SKU MD681706. Acabados de lujo y garantía de 21 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 81,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681706',
  warehouse_stock = 50,
  store_stock = 30,
  web_stock = 1,
  boxes_count = 9,
  warranty = '21 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-18-md681706';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681706', 'prod-18-md681706', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681706 referencia SKU MD681706. Acabados de lujo y garantía de 21 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 81, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681706', 50, 30, 1, 9, '21 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-18-md681706');

-- Producto 19: SKU MD680103 - Papel de colgadura MD680103
UPDATE products SET
  name = 'Papel de colgadura MD680103',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD680103 referencia SKU MD680103. Acabados de lujo y garantía de 22 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 77,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD680103',
  warehouse_stock = 40,
  store_stock = 20,
  web_stock = 7,
  boxes_count = 8,
  warranty = '22 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-19-md680103';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD680103', 'prod-19-md680103', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680103 referencia SKU MD680103. Acabados de lujo y garantía de 22 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 77, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680103', 40, 20, 7, 8, '22 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-19-md680103');

-- Producto 20: SKU MD681901 - Papel de colgadura MD681901
UPDATE products SET
  name = 'Papel de colgadura MD681901',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Papel de colgadura MD681901 referencia SKU MD681901. Acabados de lujo y garantía de 23 años.',
  price = 800000,
  original_price = 900000,
  category = 'Papel de Colgadura',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'MD681901',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '23 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-20-md681901';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Papel de colgadura MD681901', 'prod-20-md681901', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681901 referencia SKU MD681901. Acabados de lujo y garantía de 23 años.', 800000, 900000, 'Papel de Colgadura', 'Contemporáneo', 6, ARRAY['/images/cat_pared_1787548067893.jpg', '/images/cat_pared_portrait_1787589752307.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681901', 2, 2, 2, 1, '23 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-20-md681901');

-- Producto 21: SKU A725CA42 - Lavamanos A725CA42
UPDATE products SET
  name = 'Lavamanos A725CA42',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A725CA42 referencia SKU A725CA42. Acabados de lujo y garantía de 1 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A725CA42',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '1 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-21-a725ca42';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A725CA42', 'prod-21-a725ca42', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A725CA42 referencia SKU A725CA42. Acabados de lujo y garantía de 1 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A725CA42', 5, 5, 5, 2, '1 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-21-a725ca42');

-- Producto 22: SKU RB033 - Lavamanos RB033
UPDATE products SET
  name = 'Lavamanos RB033',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos RB033 referencia SKU RB033. Acabados de lujo y garantía de 2 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 14,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'RB033',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 4,
  boxes_count = 2,
  warranty = '2 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-22-rb033';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos RB033', 'prod-22-rb033', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos RB033 referencia SKU RB033. Acabados de lujo y garantía de 2 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 14, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'RB033', 5, 5, 4, 2, '2 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-22-rb033');

-- Producto 23: SKU A585AP01M - Lavamanos A585AP01M
UPDATE products SET
  name = 'Lavamanos A585AP01M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A585AP01M referencia SKU A585AP01M. Acabados de lujo y garantía de 3 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A585AP01M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '3 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-23-a585ap01m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A585AP01M', 'prod-23-a585ap01m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A585AP01M referencia SKU A585AP01M. Acabados de lujo y garantía de 3 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A585AP01M', 5, 5, 5, 2, '3 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-23-a585ap01m');

-- Producto 24: SKU A524AP01M - Lavamanos A524AP01M
UPDATE products SET
  name = 'Lavamanos A524AP01M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A524AP01M referencia SKU A524AP01M. Acabados de lujo y garantía de 4 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A524AP01M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '4 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-24-a524ap01m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A524AP01M', 'prod-24-a524ap01m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A524AP01M referencia SKU A524AP01M. Acabados de lujo y garantía de 4 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A524AP01M', 5, 5, 5, 2, '4 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-24-a524ap01m');

-- Producto 25: SKU A691CBKUG04M - Lavamanos A691CBKUG04M
UPDATE products SET
  name = 'Lavamanos A691CBKUG04M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A691CBKUG04M referencia SKU A691CBKUG04M. Acabados de lujo y garantía de 5 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A691CBKUG04M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '5 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-25-a691cbkug04m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A691CBKUG04M', 'prod-25-a691cbkug04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A691CBKUG04M referencia SKU A691CBKUG04M. Acabados de lujo y garantía de 5 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A691CBKUG04M', 5, 5, 5, 2, '5 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-25-a691cbkug04m');

-- Producto 26: SKU A707CUG20M - Lavamanos A707CUG20M
UPDATE products SET
  name = 'Lavamanos A707CUG20M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A707CUG20M referencia SKU A707CUG20M. Acabados de lujo y garantía de 6 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A707CUG20M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '6 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-26-a707cug20m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A707CUG20M', 'prod-26-a707cug20m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A707CUG20M referencia SKU A707CUG20M. Acabados de lujo y garantía de 6 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A707CUG20M', 5, 5, 5, 2, '6 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-26-a707cug20m');

-- Producto 27: SKU A709CUG01M - Lavamanos A709CUG01M
UPDATE products SET
  name = 'Lavamanos A709CUG01M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A709CUG01M referencia SKU A709CUG01M. Acabados de lujo y garantía de 7 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A709CUG01M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '7 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-27-a709cug01m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A709CUG01M', 'prod-27-a709cug01m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A709CUG01M referencia SKU A709CUG01M. Acabados de lujo y garantía de 7 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A709CUG01M', 5, 5, 5, 2, '7 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-27-a709cug01m');

-- Producto 28: SKU A706CUG04M - Lavamanos A706CUG04M
UPDATE products SET
  name = 'Lavamanos A706CUG04M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A706CUG04M referencia SKU A706CUG04M. Acabados de lujo y garantía de 8 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A706CUG04M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '8 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-28-a706cug04m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A706CUG04M', 'prod-28-a706cug04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A706CUG04M referencia SKU A706CUG04M. Acabados de lujo y garantía de 8 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A706CUG04M', 5, 5, 5, 2, '8 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-28-a706cug04m');

-- Producto 29: SKU A787P45M - Lavamanos A787P45M
UPDATE products SET
  name = 'Lavamanos A787P45M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A787P45M referencia SKU A787P45M. Acabados de lujo y garantía de 9 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 14,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A787P45M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 4,
  boxes_count = 2,
  warranty = '9 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-29-a787p45m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A787P45M', 'prod-29-a787p45m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787P45M referencia SKU A787P45M. Acabados de lujo y garantía de 9 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 14, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787P45M', 5, 5, 4, 2, '9 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-29-a787p45m');

-- Producto 30: SKU A739P429M - Lavamanos A739P429M
UPDATE products SET
  name = 'Lavamanos A739P429M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A739P429M referencia SKU A739P429M. Acabados de lujo y garantía de 10 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A739P429M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '10 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-30-a739p429m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A739P429M', 'prod-30-a739p429m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A739P429M referencia SKU A739P429M. Acabados de lujo y garantía de 10 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A739P429M', 5, 5, 5, 2, '10 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-30-a739p429m');

-- Producto 31: SKU A723P04M - Lavamanos A723P04M
UPDATE products SET
  name = 'Lavamanos A723P04M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A723P04M referencia SKU A723P04M. Acabados de lujo y garantía de 11 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 14,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A723P04M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 4,
  boxes_count = 2,
  warranty = '11 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-31-a723p04m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A723P04M', 'prod-31-a723p04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A723P04M referencia SKU A723P04M. Acabados de lujo y garantía de 11 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 14, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A723P04M', 5, 5, 4, 2, '11 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-31-a723p04m');

-- Producto 32: SKU A822P04M - Lavamanos A822P04M
UPDATE products SET
  name = 'Lavamanos A822P04M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A822P04M referencia SKU A822P04M. Acabados de lujo y garantía de 12 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A822P04M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '12 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-32-a822p04m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A822P04M', 'prod-32-a822p04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A822P04M referencia SKU A822P04M. Acabados de lujo y garantía de 12 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A822P04M', 5, 5, 5, 2, '12 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-32-a822p04m');

-- Producto 33: SKU A544GGCBK18 - Lavamanos A544GGCBK18
UPDATE products SET
  name = 'Lavamanos A544GGCBK18',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A544GGCBK18 referencia SKU A544GGCBK18. Acabados de lujo y garantía de 13 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A544GGCBK18',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '13 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-33-a544ggcbk18';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A544GGCBK18', 'prod-33-a544ggcbk18', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A544GGCBK18 referencia SKU A544GGCBK18. Acabados de lujo y garantía de 13 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A544GGCBK18', 5, 5, 5, 2, '13 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-33-a544ggcbk18');

-- Producto 34: SKU A787GGCBK09 - Lavamanos A787GGCBK09
UPDATE products SET
  name = 'Lavamanos A787GGCBK09',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A787GGCBK09 referencia SKU A787GGCBK09. Acabados de lujo y garantía de 14 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 14,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A787GGCBK09',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 4,
  boxes_count = 2,
  warranty = '14 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-34-a787ggcbk09';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A787GGCBK09', 'prod-34-a787ggcbk09', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787GGCBK09 referencia SKU A787GGCBK09. Acabados de lujo y garantía de 14 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 14, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787GGCBK09', 5, 5, 4, 2, '14 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-34-a787ggcbk09');

-- Producto 35: SKU A787CMCM - Lavamanos A787CMCM
UPDATE products SET
  name = 'Lavamanos A787CMCM',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A787CMCM referencia SKU A787CMCM. Acabados de lujo y garantía de 15 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A787CMCM',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '15 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-35-a787cmcm';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A787CMCM', 'prod-35-a787cmcm', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787CMCM referencia SKU A787CMCM. Acabados de lujo y garantía de 15 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787CMCM', 5, 5, 5, 2, '15 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-35-a787cmcm');

-- Producto 36: SKU A734CLKAM1840 - Lavamanos A734CLKAM1840
UPDATE products SET
  name = 'Lavamanos A734CLKAM1840',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A734CLKAM1840 referencia SKU A734CLKAM1840. Acabados de lujo y garantía de 16 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A734CLKAM1840',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '16 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-36-a734clkam1840';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A734CLKAM1840', 'prod-36-a734clkam1840', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A734CLKAM1840 referencia SKU A734CLKAM1840. Acabados de lujo y garantía de 16 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A734CLKAM1840', 5, 5, 5, 2, '16 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-36-a734clkam1840');

-- Producto 37: SKU A787CDGRM - Lavamanos A787CDGRM
UPDATE products SET
  name = 'Lavamanos A787CDGRM',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A787CDGRM referencia SKU A787CDGRM. Acabados de lujo y garantía de 17 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A787CDGRM',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '17 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-37-a787cdgrm';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A787CDGRM', 'prod-37-a787cdgrm', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787CDGRM referencia SKU A787CDGRM. Acabados de lujo y garantía de 17 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787CDGRM', 5, 5, 5, 2, '17 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-37-a787cdgrm');

-- Producto 38: SKU A712CA52M - Lavamanos A712CA52M
UPDATE products SET
  name = 'Lavamanos A712CA52M',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Lavamanos A712CA52M referencia SKU A712CA52M. Acabados de lujo y garantía de 18 años.',
  price = 350000,
  original_price = 400000,
  category = 'Lavamanos',
  style = 'Contemporáneo',
  stock = 15,
  images = ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'A712CA52M',
  warehouse_stock = 5,
  store_stock = 5,
  web_stock = 5,
  boxes_count = 2,
  warranty = '18 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-38-a712ca52m';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Lavamanos A712CA52M', 'prod-38-a712ca52m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A712CA52M referencia SKU A712CA52M. Acabados de lujo y garantía de 18 años.', 350000, 400000, 'Lavamanos', 'Contemporáneo', 15, ARRAY['/images/cat_mesa_1787548081162.jpg', '/images/cat_mesa_portrait_1787589762766.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A712CA52M', 5, 5, 5, 2, '18 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-38-a712ca52m');

-- Producto 39: SKU 5523 - Espejos modernos 5523
UPDATE products SET
  name = 'Espejos modernos 5523',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5523 referencia SKU 5523. Acabados de lujo y garantía de 19 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5523',
  warehouse_stock = 5,
  store_stock = 4,
  web_stock = 1,
  boxes_count = 1,
  warranty = '19 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-39-5523';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5523', 'prod-39-5523', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5523 referencia SKU 5523. Acabados de lujo y garantía de 19 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5523', 5, 4, 1, 1, '19 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-39-5523');

-- Producto 40: SKU SF021 - Espejos modernos SF021
UPDATE products SET
  name = 'Espejos modernos SF021',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos SF021 referencia SKU SF021. Acabados de lujo y garantía de 20 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'SF021',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '20 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-40-sf021';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos SF021', 'prod-40-sf021', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos SF021 referencia SKU SF021. Acabados de lujo y garantía de 20 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 5, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SF021', 2, 2, 1, 1, '20 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-40-sf021');

-- Producto 41: SKU 5814 - Espejos modernos 5814
UPDATE products SET
  name = 'Espejos modernos 5814',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5814 referencia SKU 5814. Acabados de lujo y garantía de 21 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5814',
  warehouse_stock = 5,
  store_stock = 3,
  web_stock = 2,
  boxes_count = 1,
  warranty = '21 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-41-5814';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5814', 'prod-41-5814', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5814 referencia SKU 5814. Acabados de lujo y garantía de 21 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5814', 5, 3, 2, 1, '21 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-41-5814');

-- Producto 42: SKU 5823 - Espejos modernos 5823
UPDATE products SET
  name = 'Espejos modernos 5823',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5823 referencia SKU 5823. Acabados de lujo y garantía de 22 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5823',
  warehouse_stock = 4,
  store_stock = 4,
  web_stock = 2,
  boxes_count = 1,
  warranty = '22 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-42-5823';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5823', 'prod-42-5823', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5823 referencia SKU 5823. Acabados de lujo y garantía de 22 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5823', 4, 4, 2, 1, '22 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-42-5823');

-- Producto 43: SKU 5822 - Espejos modernos 5822
UPDATE products SET
  name = 'Espejos modernos 5822',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5822 referencia SKU 5822. Acabados de lujo y garantía de 23 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5822',
  warehouse_stock = 4,
  store_stock = 4,
  web_stock = 2,
  boxes_count = 1,
  warranty = '23 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-43-5822';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5822', 'prod-43-5822', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5822 referencia SKU 5822. Acabados de lujo y garantía de 23 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5822', 4, 4, 2, 1, '23 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-43-5822');

-- Producto 44: SKU 5812 - Espejos modernos 5812
UPDATE products SET
  name = 'Espejos modernos 5812',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5812 referencia SKU 5812. Acabados de lujo y garantía de 24 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5812',
  warehouse_stock = 4,
  store_stock = 4,
  web_stock = 2,
  boxes_count = 1,
  warranty = '24 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-44-5812';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5812', 'prod-44-5812', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5812 referencia SKU 5812. Acabados de lujo y garantía de 24 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5812', 4, 4, 2, 1, '24 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-44-5812');

-- Producto 45: SKU SF021 - Espejos modernos SF021
UPDATE products SET
  name = 'Espejos modernos SF021',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos SF021 referencia SKU SF021. Acabados de lujo y garantía de 25 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'SF021',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '25 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-45-sf021';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos SF021', 'prod-45-sf021', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos SF021 referencia SKU SF021. Acabados de lujo y garantía de 25 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 5, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SF021', 2, 2, 1, 1, '25 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-45-sf021');

-- Producto 46: SKU 5343 - Espejos modernos 5343
UPDATE products SET
  name = 'Espejos modernos 5343',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5343 referencia SKU 5343. Acabados de lujo y garantía de 26 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5343',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '26 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-46-5343';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5343', 'prod-46-5343', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5343 referencia SKU 5343. Acabados de lujo y garantía de 26 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5343', 3, 3, 4, 1, '26 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-46-5343');

-- Producto 47: SKU 5911 - Espejos modernos 5911
UPDATE products SET
  name = 'Espejos modernos 5911',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5911 referencia SKU 5911. Acabados de lujo y garantía de 27 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5911',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '27 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-47-5911';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5911', 'prod-47-5911', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5911 referencia SKU 5911. Acabados de lujo y garantía de 27 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5911', 3, 3, 4, 1, '27 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-47-5911');

-- Producto 48: SKU 5334 - Espejos modernos 5334
UPDATE products SET
  name = 'Espejos modernos 5334',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5334 referencia SKU 5334. Acabados de lujo y garantía de 28 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5334',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '28 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-48-5334';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5334', 'prod-48-5334', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5334 referencia SKU 5334. Acabados de lujo y garantía de 28 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5334', 3, 3, 4, 1, '28 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-48-5334');

-- Producto 49: SKU 6411 - Espejos modernos 6411
UPDATE products SET
  name = 'Espejos modernos 6411',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 6411 referencia SKU 6411. Acabados de lujo y garantía de 29 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '6411',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '29 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-49-6411';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 6411', 'prod-49-6411', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 6411 referencia SKU 6411. Acabados de lujo y garantía de 29 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '6411', 3, 3, 4, 1, '29 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-49-6411');

-- Producto 50: SKU 5322 - Espejos modernos 5322
UPDATE products SET
  name = 'Espejos modernos 5322',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5322 referencia SKU 5322. Acabados de lujo y garantía de 30 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5322',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '30 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-50-5322';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5322', 'prod-50-5322', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5322 referencia SKU 5322. Acabados de lujo y garantía de 30 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5322', 3, 3, 4, 1, '30 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-50-5322');

-- Producto 51: SKU 5101 - Espejos modernos 5101
UPDATE products SET
  name = 'Espejos modernos 5101',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5101 referencia SKU 5101. Acabados de lujo y garantía de 31 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5101',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '31 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-51-5101';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5101', 'prod-51-5101', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5101 referencia SKU 5101. Acabados de lujo y garantía de 31 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5101', 3, 3, 4, 1, '31 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-51-5101');

-- Producto 52: SKU 5512 - Espejos modernos 5512
UPDATE products SET
  name = 'Espejos modernos 5512',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5512 referencia SKU 5512. Acabados de lujo y garantía de 32 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5512',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '32 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-52-5512';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5512', 'prod-52-5512', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5512 referencia SKU 5512. Acabados de lujo y garantía de 32 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5512', 3, 3, 4, 1, '32 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-52-5512');

-- Producto 53: SKU SF022 - Espejos modernos SF022
UPDATE products SET
  name = 'Espejos modernos SF022',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos SF022 referencia SKU SF022. Acabados de lujo y garantía de 33 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'SF022',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '33 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-53-sf022';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos SF022', 'prod-53-sf022', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos SF022 referencia SKU SF022. Acabados de lujo y garantía de 33 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SF022', 3, 3, 4, 1, '33 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-53-sf022');

-- Producto 54: SKU 5519 - Espejos modernos 5519
UPDATE products SET
  name = 'Espejos modernos 5519',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5519 referencia SKU 5519. Acabados de lujo y garantía de 34 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5519',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '34 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-54-5519';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5519', 'prod-54-5519', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5519 referencia SKU 5519. Acabados de lujo y garantía de 34 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5519', 3, 3, 4, 1, '34 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-54-5519');

-- Producto 55: SKU 5520 - Espejos modernos 5520
UPDATE products SET
  name = 'Espejos modernos 5520',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5520 referencia SKU 5520. Acabados de lujo y garantía de 35 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5520',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '35 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-55-5520';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5520', 'prod-55-5520', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5520 referencia SKU 5520. Acabados de lujo y garantía de 35 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5520', 3, 3, 4, 1, '35 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-55-5520');

-- Producto 56: SKU 6421 - Espejos modernos 6421
UPDATE products SET
  name = 'Espejos modernos 6421',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 6421 referencia SKU 6421. Acabados de lujo y garantía de 36 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '6421',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '36 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-56-6421';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 6421', 'prod-56-6421', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 6421 referencia SKU 6421. Acabados de lujo y garantía de 36 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '6421', 3, 3, 4, 1, '36 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-56-6421');

-- Producto 57: SKU 5521 - Espejos modernos 5521
UPDATE products SET
  name = 'Espejos modernos 5521',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5521 referencia SKU 5521. Acabados de lujo y garantía de 37 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5521',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '37 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-57-5521';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5521', 'prod-57-5521', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5521 referencia SKU 5521. Acabados de lujo y garantía de 37 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5521', 3, 3, 4, 1, '37 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-57-5521');

-- Producto 58: SKU 5351 - Espejos modernos 5351
UPDATE products SET
  name = 'Espejos modernos 5351',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos modernos 5351 referencia SKU 5351. Acabados de lujo y garantía de 38 años.',
  price = 980000,
  original_price = 1000000,
  category = 'Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = '5351',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '38 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-58-5351';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos modernos 5351', 'prod-58-5351', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5351 referencia SKU 5351. Acabados de lujo y garantía de 38 años.', 980000, 1000000, 'Espejos', 'Contemporáneo', 10, ARRAY['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5351', 3, 3, 4, 1, '38 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-58-5351');

-- Producto 59: SKU HP120X900947 - Espejos y cuadros HP120X900947
UPDATE products SET
  name = 'Espejos y cuadros HP120X900947',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP120X900947 referencia SKU HP120X900947. Acabados de lujo y garantía de 38 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP120X900947',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '38 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-59-hp120x900947';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP120X900947', 'prod-59-hp120x900947', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900947 referencia SKU HP120X900947. Acabados de lujo y garantía de 38 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900947', 2, 2, 1, 1, '38 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-59-hp120x900947');

-- Producto 60: SKU HP120X900948 - Espejos y cuadros HP120X900948
UPDATE products SET
  name = 'Espejos y cuadros HP120X900948',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP120X900948 referencia SKU HP120X900948. Acabados de lujo y garantía de 39 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP120X900948',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '39 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-60-hp120x900948';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP120X900948', 'prod-60-hp120x900948', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900948 referencia SKU HP120X900948. Acabados de lujo y garantía de 39 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900948', 2, 2, 1, 1, '39 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-60-hp120x900948');

-- Producto 61: SKU HP120X900963 - Espejos y cuadros HP120X900963
UPDATE products SET
  name = 'Espejos y cuadros HP120X900963',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP120X900963 referencia SKU HP120X900963. Acabados de lujo y garantía de 40 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP120X900963',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '40 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-61-hp120x900963';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP120X900963', 'prod-61-hp120x900963', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900963 referencia SKU HP120X900963. Acabados de lujo y garantía de 40 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900963', 2, 2, 1, 1, '40 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-61-hp120x900963');

-- Producto 62: SKU HP120X900964 - Espejos y cuadros HP120X900964
UPDATE products SET
  name = 'Espejos y cuadros HP120X900964',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP120X900964 referencia SKU HP120X900964. Acabados de lujo y garantía de 41 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP120X900964',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '41 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-62-hp120x900964';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP120X900964', 'prod-62-hp120x900964', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900964 referencia SKU HP120X900964. Acabados de lujo y garantía de 41 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900964', 2, 2, 1, 1, '41 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-62-hp120x900964');

-- Producto 63: SKU HP70X1401465 - Espejos y cuadros HP70X1401465
UPDATE products SET
  name = 'Espejos y cuadros HP70X1401465',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP70X1401465 referencia SKU HP70X1401465. Acabados de lujo y garantía de 42 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP70X1401465',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '42 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-63-hp70x1401465';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP70X1401465', 'prod-63-hp70x1401465', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP70X1401465 referencia SKU HP70X1401465. Acabados de lujo y garantía de 42 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP70X1401465', 2, 2, 1, 1, '42 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-63-hp70x1401465');

-- Producto 64: SKU HP50X1501546 - Espejos y cuadros HP50X1501546
UPDATE products SET
  name = 'Espejos y cuadros HP50X1501546',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP50X1501546 referencia SKU HP50X1501546. Acabados de lujo y garantía de 43 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP50X1501546',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '43 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-64-hp50x1501546';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP50X1501546', 'prod-64-hp50x1501546', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP50X1501546 referencia SKU HP50X1501546. Acabados de lujo y garantía de 43 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP50X1501546', 2, 2, 1, 1, '43 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-64-hp50x1501546');

-- Producto 65: SKU HP80X801097 - Espejos y cuadros HP80X801097
UPDATE products SET
  name = 'Espejos y cuadros HP80X801097',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP80X801097 referencia SKU HP80X801097. Acabados de lujo y garantía de 44 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP80X801097',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '44 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-65-hp80x801097';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP80X801097', 'prod-65-hp80x801097', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801097 referencia SKU HP80X801097. Acabados de lujo y garantía de 44 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801097', 2, 2, 2, 1, '44 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-65-hp80x801097');

-- Producto 66: SKU HP80X801098 - Espejos y cuadros HP80X801098
UPDATE products SET
  name = 'Espejos y cuadros HP80X801098',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP80X801098 referencia SKU HP80X801098. Acabados de lujo y garantía de 45 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP80X801098',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '45 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-66-hp80x801098';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP80X801098', 'prod-66-hp80x801098', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801098 referencia SKU HP80X801098. Acabados de lujo y garantía de 45 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801098', 2, 2, 2, 1, '45 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-66-hp80x801098');

-- Producto 67: SKU HP80X801103 - Espejos y cuadros HP80X801103
UPDATE products SET
  name = 'Espejos y cuadros HP80X801103',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP80X801103 referencia SKU HP80X801103. Acabados de lujo y garantía de 46 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP80X801103',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '46 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-67-hp80x801103';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP80X801103', 'prod-67-hp80x801103', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801103 referencia SKU HP80X801103. Acabados de lujo y garantía de 46 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801103', 2, 2, 2, 1, '46 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-67-hp80x801103');

-- Producto 68: SKU HP80X801104 - Espejos y cuadros HP80X801104
UPDATE products SET
  name = 'Espejos y cuadros HP80X801104',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP80X801104 referencia SKU HP80X801104. Acabados de lujo y garantía de 47 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP80X801104',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '47 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-68-hp80x801104';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP80X801104', 'prod-68-hp80x801104', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801104 referencia SKU HP80X801104. Acabados de lujo y garantía de 47 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801104', 2, 2, 2, 1, '47 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-68-hp80x801104');

-- Producto 69: SKU HP100X1400921 - Espejos y cuadros HP100X1400921
UPDATE products SET
  name = 'Espejos y cuadros HP100X1400921',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP100X1400921 referencia SKU HP100X1400921. Acabados de lujo y garantía de 48 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP100X1400921',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '48 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-69-hp100x1400921';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP100X1400921', 'prod-69-hp100x1400921', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP100X1400921 referencia SKU HP100X1400921. Acabados de lujo y garantía de 48 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP100X1400921', 2, 2, 1, 1, '48 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-69-hp100x1400921');

-- Producto 70: SKU HP100X1400923 - Espejos y cuadros HP100X1400923
UPDATE products SET
  name = 'Espejos y cuadros HP100X1400923',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros HP100X1400923 referencia SKU HP100X1400923. Acabados de lujo y garantía de 49 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'HP100X1400923',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '49 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-70-hp100x1400923';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros HP100X1400923', 'prod-70-hp100x1400923', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP100X1400923 referencia SKU HP100X1400923. Acabados de lujo y garantía de 49 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP100X1400923', 2, 2, 1, 1, '49 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-70-hp100x1400923');

-- Producto 71: SKU GY78X781606 - Espejos y cuadros GY78X781606
UPDATE products SET
  name = 'Espejos y cuadros GY78X781606',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY78X781606 referencia SKU GY78X781606. Acabados de lujo y garantía de 50 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY78X781606',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '50 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-71-gy78x781606';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY78X781606', 'prod-71-gy78x781606', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY78X781606 referencia SKU GY78X781606. Acabados de lujo y garantía de 50 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY78X781606', 2, 2, 2, 1, '50 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-71-gy78x781606');

-- Producto 72: SKU GY87X871608 - Espejos y cuadros GY87X871608
UPDATE products SET
  name = 'Espejos y cuadros GY87X871608',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY87X871608 referencia SKU GY87X871608. Acabados de lujo y garantía de 51 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY87X871608',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '51 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-72-gy87x871608';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY87X871608', 'prod-72-gy87x871608', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY87X871608 referencia SKU GY87X871608. Acabados de lujo y garantía de 51 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY87X871608', 2, 2, 2, 1, '51 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-72-gy87x871608');

-- Producto 73: SKU GY50X1501601 - Espejos y cuadros GY50X1501601
UPDATE products SET
  name = 'Espejos y cuadros GY50X1501601',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY50X1501601 referencia SKU GY50X1501601. Acabados de lujo y garantía de 52 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY50X1501601',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '52 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-73-gy50x1501601';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY50X1501601', 'prod-73-gy50x1501601', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY50X1501601 referencia SKU GY50X1501601. Acabados de lujo y garantía de 52 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY50X1501601', 2, 2, 2, 1, '52 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-73-gy50x1501601');

-- Producto 74: SKU GY50X1501604 - Espejos y cuadros GY50X1501604
UPDATE products SET
  name = 'Espejos y cuadros GY50X1501604',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY50X1501604 referencia SKU GY50X1501604. Acabados de lujo y garantía de 53 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY50X1501604',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '53 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-74-gy50x1501604';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY50X1501604', 'prod-74-gy50x1501604', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY50X1501604 referencia SKU GY50X1501604. Acabados de lujo y garantía de 53 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY50X1501604', 2, 2, 2, 1, '53 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-74-gy50x1501604');

-- Producto 75: SKU GY77X1171589 - Espejos y cuadros GY77X1171589
UPDATE products SET
  name = 'Espejos y cuadros GY77X1171589',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY77X1171589 referencia SKU GY77X1171589. Acabados de lujo y garantía de 54 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 5,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY77X1171589',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 1,
  boxes_count = 1,
  warranty = '54 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-75-gy77x1171589';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY77X1171589', 'prod-75-gy77x1171589', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY77X1171589 referencia SKU GY77X1171589. Acabados de lujo y garantía de 54 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 5, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY77X1171589', 2, 2, 1, 1, '54 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-75-gy77x1171589');

-- Producto 76: SKU GY77X1171593 - Espejos y cuadros GY77X1171593
UPDATE products SET
  name = 'Espejos y cuadros GY77X1171593',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY77X1171593 referencia SKU GY77X1171593. Acabados de lujo y garantía de 55 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY77X1171593',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '55 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-76-gy77x1171593';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY77X1171593', 'prod-76-gy77x1171593', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY77X1171593 referencia SKU GY77X1171593. Acabados de lujo y garantía de 55 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY77X1171593', 2, 2, 2, 1, '55 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-76-gy77x1171593');

-- Producto 77: SKU GY77X1171594 - Espejos y cuadros GY77X1171594
UPDATE products SET
  name = 'Espejos y cuadros GY77X1171594',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros GY77X1171594 referencia SKU GY77X1171594. Acabados de lujo y garantía de 56 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 6,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'GY77X1171594',
  warehouse_stock = 2,
  store_stock = 2,
  web_stock = 2,
  boxes_count = 1,
  warranty = '56 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-77-gy77x1171594';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros GY77X1171594', 'prod-77-gy77x1171594', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY77X1171594 referencia SKU GY77X1171594. Acabados de lujo y garantía de 56 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 6, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY77X1171594', 2, 2, 2, 1, '56 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-77-gy77x1171594');

-- Producto 78: SKU AH60160045GD - Espejos y cuadros AH60160045GD
UPDATE products SET
  name = 'Espejos y cuadros AH60160045GD',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160045GD referencia SKU AH60160045GD. Acabados de lujo y garantía de 57 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160045GD',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '57 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-78-ah60160045gd';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160045GD', 'prod-78-ah60160045gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160045GD referencia SKU AH60160045GD. Acabados de lujo y garantía de 57 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160045GD', 3, 3, 4, 1, '57 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-78-ah60160045gd');

-- Producto 79: SKU AH60160045BK - Espejos y cuadros AH60160045BK
UPDATE products SET
  name = 'Espejos y cuadros AH60160045BK',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160045BK referencia SKU AH60160045BK. Acabados de lujo y garantía de 58 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160045BK',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '58 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-79-ah60160045bk';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160045BK', 'prod-79-ah60160045bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160045BK referencia SKU AH60160045BK. Acabados de lujo y garantía de 58 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160045BK', 3, 3, 4, 1, '58 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-79-ah60160045bk');

-- Producto 80: SKU SWR80070 - Espejos y cuadros SWR80070
UPDATE products SET
  name = 'Espejos y cuadros SWR80070',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros SWR80070 referencia SKU SWR80070. Acabados de lujo y garantía de 59 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'SWR80070',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '59 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-80-swr80070';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros SWR80070', 'prod-80-swr80070', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros SWR80070 referencia SKU SWR80070. Acabados de lujo y garantía de 59 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SWR80070', 3, 3, 4, 1, '59 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-80-swr80070');

-- Producto 81: SKU AH60120040 - Espejos y cuadros AH60120040
UPDATE products SET
  name = 'Espejos y cuadros AH60120040',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60120040 referencia SKU AH60120040. Acabados de lujo y garantía de 60 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60120040',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '60 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-81-ah60120040';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60120040', 'prod-81-ah60120040', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120040 referencia SKU AH60120040. Acabados de lujo y garantía de 60 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120040', 3, 3, 4, 1, '60 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-81-ah60120040');

-- Producto 82: SKU AH60120043 - Espejos y cuadros AH60120043
UPDATE products SET
  name = 'Espejos y cuadros AH60120043',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60120043 referencia SKU AH60120043. Acabados de lujo y garantía de 61 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60120043',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '61 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-82-ah60120043';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60120043', 'prod-82-ah60120043', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120043 referencia SKU AH60120043. Acabados de lujo y garantía de 61 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120043', 3, 3, 4, 1, '61 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-82-ah60120043');

-- Producto 83: SKU AH60120037BK - Espejos y cuadros AH60120037BK
UPDATE products SET
  name = 'Espejos y cuadros AH60120037BK',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60120037BK referencia SKU AH60120037BK. Acabados de lujo y garantía de 62 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60120037BK',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '62 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-83-ah60120037bk';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60120037BK', 'prod-83-ah60120037bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120037BK referencia SKU AH60120037BK. Acabados de lujo y garantía de 62 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120037BK', 3, 3, 4, 1, '62 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-83-ah60120037bk');

-- Producto 84: SKU AH60120037GD - Espejos y cuadros AH60120037GD
UPDATE products SET
  name = 'Espejos y cuadros AH60120037GD',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60120037GD referencia SKU AH60120037GD. Acabados de lujo y garantía de 63 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60120037GD',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '63 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-84-ah60120037gd';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60120037GD', 'prod-84-ah60120037gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120037GD referencia SKU AH60120037GD. Acabados de lujo y garantía de 63 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120037GD', 3, 3, 4, 1, '63 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-84-ah60120037gd');

-- Producto 85: SKU AH60160051BK - Espejos y cuadros AH60160051BK
UPDATE products SET
  name = 'Espejos y cuadros AH60160051BK',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160051BK referencia SKU AH60160051BK. Acabados de lujo y garantía de 64 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160051BK',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '64 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-85-ah60160051bk';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160051BK', 'prod-85-ah60160051bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160051BK referencia SKU AH60160051BK. Acabados de lujo y garantía de 64 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160051BK', 3, 3, 4, 1, '64 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-85-ah60160051bk');

-- Producto 86: SKU AH60160051GD - Espejos y cuadros AH60160051GD
UPDATE products SET
  name = 'Espejos y cuadros AH60160051GD',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160051GD referencia SKU AH60160051GD. Acabados de lujo y garantía de 65 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160051GD',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '65 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-86-ah60160051gd';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160051GD', 'prod-86-ah60160051gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160051GD referencia SKU AH60160051GD. Acabados de lujo y garantía de 65 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160051GD', 3, 3, 4, 1, '65 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-86-ah60160051gd');

-- Producto 87: SKU AH60160050BK - Espejos y cuadros AH60160050BK
UPDATE products SET
  name = 'Espejos y cuadros AH60160050BK',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160050BK referencia SKU AH60160050BK. Acabados de lujo y garantía de 66 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160050BK',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '66 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-87-ah60160050bk';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160050BK', 'prod-87-ah60160050bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160050BK referencia SKU AH60160050BK. Acabados de lujo y garantía de 66 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160050BK', 3, 3, 4, 1, '66 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-87-ah60160050bk');

-- Producto 88: SKU AH60160050GD - Espejos y cuadros AH60160050GD
UPDATE products SET
  name = 'Espejos y cuadros AH60160050GD',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160050GD referencia SKU AH60160050GD. Acabados de lujo y garantía de 67 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160050GD',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '67 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-88-ah60160050gd';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160050GD', 'prod-88-ah60160050gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160050GD referencia SKU AH60160050GD. Acabados de lujo y garantía de 67 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160050GD', 3, 3, 4, 1, '67 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-88-ah60160050gd');

-- Producto 89: SKU AHR80001 - Espejos y cuadros AHR80001
UPDATE products SET
  name = 'Espejos y cuadros AHR80001',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AHR80001 referencia SKU AHR80001. Acabados de lujo y garantía de 68 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AHR80001',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '68 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-89-ahr80001';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AHR80001', 'prod-89-ahr80001', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AHR80001 referencia SKU AHR80001. Acabados de lujo y garantía de 68 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AHR80001', 3, 3, 4, 1, '68 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-89-ahr80001');

-- Producto 90: SKU AHR80006GD - Espejos y cuadros AHR80006GD
UPDATE products SET
  name = 'Espejos y cuadros AHR80006GD',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AHR80006GD referencia SKU AHR80006GD. Acabados de lujo y garantía de 69 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AHR80006GD',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '69 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-90-ahr80006gd';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AHR80006GD', 'prod-90-ahr80006gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AHR80006GD referencia SKU AHR80006GD. Acabados de lujo y garantía de 69 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AHR80006GD', 3, 3, 4, 1, '69 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-90-ahr80006gd');

-- Producto 91: SKU AHR80006BK - Espejos y cuadros AHR80006BK
UPDATE products SET
  name = 'Espejos y cuadros AHR80006BK',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AHR80006BK referencia SKU AHR80006BK. Acabados de lujo y garantía de 70 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AHR80006BK',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '70 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-91-ahr80006bk';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AHR80006BK', 'prod-91-ahr80006bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AHR80006BK referencia SKU AHR80006BK. Acabados de lujo y garantía de 70 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AHR80006BK', 3, 3, 4, 1, '70 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-91-ahr80006bk');

-- Producto 92: SKU AH60160022BK - Espejos y cuadros AH60160022BK
UPDATE products SET
  name = 'Espejos y cuadros AH60160022BK',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160022BK referencia SKU AH60160022BK. Acabados de lujo y garantía de 71 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160022BK',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '71 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-92-ah60160022bk';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160022BK', 'prod-92-ah60160022bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160022BK referencia SKU AH60160022BK. Acabados de lujo y garantía de 71 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160022BK', 3, 3, 4, 1, '71 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-92-ah60160022bk');

-- Producto 93: SKU AH60160022GD - Espejos y cuadros AH60160022GD
UPDATE products SET
  name = 'Espejos y cuadros AH60160022GD',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Espejos y cuadros AH60160022GD referencia SKU AH60160022GD. Acabados de lujo y garantía de 72 años.',
  price = 750000,
  original_price = 1500000,
  category = 'Cuadros & Espejos',
  style = 'Contemporáneo',
  stock = 10,
  images = ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'AH60160022GD',
  warehouse_stock = 3,
  store_stock = 3,
  web_stock = 4,
  boxes_count = 1,
  warranty = '72 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-93-ah60160022gd';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Espejos y cuadros AH60160022GD', 'prod-93-ah60160022gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160022GD referencia SKU AH60160022GD. Acabados de lujo y garantía de 72 años.', 750000, 1500000, 'Cuadros & Espejos', 'Contemporáneo', 10, ARRAY['/images/cat_pie_1787548052523.jpg', '/images/cat_pie_portrait_1787589741558.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160022GD', 3, 3, 4, 1, '72 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-93-ah60160022gd');

-- Producto 94: SKU Flexible-Stone-Panel -(Startmoon stone) - Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone)
UPDATE products SET
  name = 'Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone)',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone) referencia SKU Flexible-Stone-Panel -(Startmoon stone). Acabados de lujo y garantía de 70 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel -(Startmoon stone)',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '70 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-94-flexiblestonepanelstartmoonstone';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone)', 'prod-94-flexiblestonepanelstartmoonstone', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone) referencia SKU Flexible-Stone-Panel -(Startmoon stone). Acabados de lujo y garantía de 70 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel -(Startmoon stone)', 20, 20, 10, 5, '70 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-94-flexiblestonepanelstartmoonstone');

-- Producto 95: SKU Flexible-Stone-Panel-(Weaving) - Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving)
UPDATE products SET
  name = 'Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving)',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving) referencia SKU Flexible-Stone-Panel-(Weaving). Acabados de lujo y garantía de 71 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel-(Weaving)',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '71 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-95-flexiblestonepanelweaving';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving)', 'prod-95-flexiblestonepanelweaving', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving) referencia SKU Flexible-Stone-Panel-(Weaving). Acabados de lujo y garantía de 71 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Weaving)', 20, 20, 10, 5, '71 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-95-flexiblestonepanelweaving');

-- Producto 96: SKU Flexible-Stone-Panel-(Line stone board) - Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board)
UPDATE products SET
  name = 'Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board)',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board) referencia SKU Flexible-Stone-Panel-(Line stone board). Acabados de lujo y garantía de 72 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel-(Line stone board)',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '72 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-96-flexiblestonepanellinestoneboard';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board)', 'prod-96-flexiblestonepanellinestoneboard', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board) referencia SKU Flexible-Stone-Panel-(Line stone board). Acabados de lujo y garantía de 72 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Line stone board)', 20, 20, 10, 5, '72 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-96-flexiblestonepanellinestoneboard');

-- Producto 97: SKU Travertine-Flexible-Stone-Panel-(Travertine)-3 - Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3
UPDATE products SET
  name = 'Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3 referencia SKU Travertine-Flexible-Stone-Panel-(Travertine)-3. Acabados de lujo y garantía de 73 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Travertine-Flexible-Stone-Panel-(Travertine)-3',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '73 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-97-travertineflexiblestonepaneltravertine3';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3', 'prod-97-travertineflexiblestonepaneltravertine3', 'Diseño Tu Espacio Collection', 'Pieza de autor Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3 referencia SKU Travertine-Flexible-Stone-Panel-(Travertine)-3. Acabados de lujo y garantía de 73 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Travertine-Flexible-Stone-Panel-(Travertine)-3', 20, 20, 10, 5, '73 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-97-travertineflexiblestonepaneltravertine3');

-- Producto 98: SKU Flexible-Stone Panel-(Travertine)-2 - Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2
UPDATE products SET
  name = 'Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2 referencia SKU Flexible-Stone Panel-(Travertine)-2. Acabados de lujo y garantía de 74 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone Panel-(Travertine)-2',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '74 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-98-flexiblestonepaneltravertine2';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2', 'prod-98-flexiblestonepaneltravertine2', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2 referencia SKU Flexible-Stone Panel-(Travertine)-2. Acabados de lujo y garantía de 74 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone Panel-(Travertine)-2', 20, 20, 10, 5, '74 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-98-flexiblestonepaneltravertine2');

-- Producto 99: SKU Flexible-Stone-Panel-(Travertine)-1 - Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1
UPDATE products SET
  name = 'Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1 referencia SKU Flexible-Stone-Panel-(Travertine)-1. Acabados de lujo y garantía de 75 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel-(Travertine)-1',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '75 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-99-flexiblestonepaneltravertine1';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1', 'prod-99-flexiblestonepaneltravertine1', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1 referencia SKU Flexible-Stone-Panel-(Travertine)-1. Acabados de lujo y garantía de 75 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Travertine)-1', 20, 20, 10, 5, '75 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-99-flexiblestonepaneltravertine1');

-- Producto 100: SKU Flexible-Stone-Panel-(Square line stone) - Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone)
UPDATE products SET
  name = 'Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone)',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone) referencia SKU Flexible-Stone-Panel-(Square line stone). Acabados de lujo y garantía de 76 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel-(Square line stone)',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '76 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-100-flexiblestonepanelsquarelinestone';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone)', 'prod-100-flexiblestonepanelsquarelinestone', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone) referencia SKU Flexible-Stone-Panel-(Square line stone). Acabados de lujo y garantía de 76 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Square line stone)', 20, 20, 10, 5, '76 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-100-flexiblestonepanelsquarelinestone');

-- Producto 101: SKU Flexible-Stone-Panel-(Slate) - Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate)
UPDATE products SET
  name = 'Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate)',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate) referencia SKU Flexible-Stone-Panel-(Slate). Acabados de lujo y garantía de 77 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel-(Slate)',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '77 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-101-flexiblestonepanelslate';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate)', 'prod-101-flexiblestonepanelslate', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate) referencia SKU Flexible-Stone-Panel-(Slate). Acabados de lujo y garantía de 77 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Slate)', 20, 20, 10, 5, '77 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-101-flexiblestonepanelslate');

-- Producto 102: SKU Flexible-Stone-Panel-(Rockcut Stone) - Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone)
UPDATE products SET
  name = 'Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone)',
  brand_collection = 'Diseño Tu Espacio Collection',
  description = 'Pieza de autor Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone) referencia SKU Flexible-Stone-Panel-(Rockcut Stone). Acabados de lujo y garantía de 78 años.',
  price = 750000,
  original_price = 1200000,
  category = 'Revestimientos',
  style = 'Contemporáneo',
  stock = 50,
  images = ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[],
  colors = '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb,
  is_featured = false,
  dimensions = 'Estándar Arquitectónico',
  materials = 'Materiales de Alta Gama',
  sku = 'Flexible-Stone-Panel-(Rockcut Stone)',
  warehouse_stock = 20,
  store_stock = 20,
  web_stock = 10,
  boxes_count = 5,
  warranty = '78 años',
  inventory_status = 'Disponible'
WHERE slug = 'prod-102-flexiblestonepanelrockcutstone';

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
)
SELECT
  'Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone)', 'prod-102-flexiblestonepanelrockcutstone', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone) referencia SKU Flexible-Stone-Panel-(Rockcut Stone). Acabados de lujo y garantía de 78 años.', 750000, 1200000, 'Revestimientos', 'Contemporáneo', 50, ARRAY['/images/cat_techo_1787548027809.jpg', '/images/cat_techo_portrait_1787589732026.jpg']::text[], '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Rockcut Stone)', 20, 20, 10, 5, '78 años', 'Disponible'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'prod-102-flexiblestonepanelrockcutstone');

