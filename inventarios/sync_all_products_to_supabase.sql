-- SCRIPT DE POBLACIÓN Y SINCRONIZACIÓN COMPLETA PARA SUPABASE POSTGRESQL
-- Copiar todo este código y ejecutar en: Supabase Dashboard -> SQL Editor

-- 1. Agregar las 7 columnas de inventario a la tabla 'products'
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS warehouse_stock INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS store_stock INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS web_stock INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS boxes_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '3 años',
ADD COLUMN IF NOT EXISTS inventory_status TEXT DEFAULT 'Disponible';

-- 2. Crear índice único en slug para permitir ON CONFLICT (slug)
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products(slug);

-- 3. Insertar / Actualizar los 102 productos con SKU, stock bodega/tienda/web y garantía
INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680101', 'prod-1-md680101', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680101 referencia SKU MD680101. Acabados de lujo y garantía de 4 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 80, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680101', 40, 35, 5, 8, '4 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680209', 'prod-2-md680209', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680209 referencia SKU MD680209. Acabados de lujo y garantía de 5 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 86, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680209', 40, 40, 6, 9, '5 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680301', 'prod-3-md680301', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680301 referencia SKU MD680301. Acabados de lujo y garantía de 6 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 79, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680301', 40, 30, 9, 8, '6 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680313', 'prod-4-md680313', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680313 referencia SKU MD680313. Acabados de lujo y garantía de 7 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 79, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680313', 40, 30, 9, 8, '7 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680312', 'prod-5-md680312', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680312 referencia SKU MD680312. Acabados de lujo y garantía de 8 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 82, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680312', 40, 40, 2, 9, '8 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680402B', 'prod-6-md680402b', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680402B referencia SKU MD680402B. Acabados de lujo y garantía de 9 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 78, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680402B', 30, 40, 8, 8, '9 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680510-B', 'prod-7-md680510b', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680510-B referencia SKU MD680510-B. Acabados de lujo y garantía de 10 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 94, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680510-B', 50, 40, 4, 10, '10 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680512-B', 'prod-8-md680512b', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680512-B referencia SKU MD680512-B. Acabados de lujo y garantía de 11 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 70, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680512-B', 40, 30, 5, 7, '11 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680603', 'prod-9-md680603', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680603 referencia SKU MD680603. Acabados de lujo y garantía de 12 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 74, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680603', 40, 30, 4, 8, '12 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680704', 'prod-10-md680704', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680704 referencia SKU MD680704. Acabados de lujo y garantía de 13 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 0, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680704', 0, 0, 0, 0, '13 años', 'Agotado'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680904', 'prod-11-md680904', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680904 referencia SKU MD680904. Acabados de lujo y garantía de 14 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 65, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680904', 30, 30, 5, 7, '14 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681014', 'prod-12-md681014', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681014 referencia SKU MD681014. Acabados de lujo y garantía de 15 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 71, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681014', 40, 30, 1, 8, '15 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681113', 'prod-13-md681113', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681113 referencia SKU MD681113. Acabados de lujo y garantía de 16 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 71, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681113', 40, 30, 1, 8, '16 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681209', 'prod-14-md681209', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681209 referencia SKU MD681209. Acabados de lujo y garantía de 17 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 75, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681209', 40, 30, 5, 8, '17 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681309', 'prod-15-md681309', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681309 referencia SKU MD681309. Acabados de lujo y garantía de 18 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 75, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681309', 40, 30, 5, 8, '18 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681412', 'prod-16-md681412', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681412 referencia SKU MD681412. Acabados de lujo y garantía de 19 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 86, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681412', 40, 40, 6, 9, '19 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681511', 'prod-17-md681511', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681511 referencia SKU MD681511. Acabados de lujo y garantía de 20 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 84, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681511', 40, 40, 4, 9, '20 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681706', 'prod-18-md681706', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681706 referencia SKU MD681706. Acabados de lujo y garantía de 21 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 81, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681706', 50, 30, 1, 9, '21 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD680103', 'prod-19-md680103', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD680103 referencia SKU MD680103. Acabados de lujo y garantía de 22 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 77, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD680103', 40, 20, 7, 8, '22 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Papel de colgadura MD681901', 'prod-20-md681901', 'Diseño Tu Espacio Collection', 'Pieza de autor Papel de colgadura MD681901 referencia SKU MD681901. Acabados de lujo y garantía de 23 años.', 900000, 800000, 'Papel de Colgadura', 'Contemporáneo', 6, '["/images/cat_pared_1787548067893.jpg","/images/cat_pared_portrait_1787589752307.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'MD681901', 2, 2, 2, 1, '23 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A725CA42', 'prod-21-a725ca42', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A725CA42 referencia SKU A725CA42. Acabados de lujo y garantía de 1 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A725CA42', 5, 5, 5, 2, '1 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos RB033', 'prod-22-rb033', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos RB033 referencia SKU RB033. Acabados de lujo y garantía de 2 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 14, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'RB033', 5, 5, 4, 2, '2 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A585AP01M', 'prod-23-a585ap01m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A585AP01M referencia SKU A585AP01M. Acabados de lujo y garantía de 3 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A585AP01M', 5, 5, 5, 2, '3 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A524AP01M', 'prod-24-a524ap01m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A524AP01M referencia SKU A524AP01M. Acabados de lujo y garantía de 4 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A524AP01M', 5, 5, 5, 2, '4 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A691CBKUG04M', 'prod-25-a691cbkug04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A691CBKUG04M referencia SKU A691CBKUG04M. Acabados de lujo y garantía de 5 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A691CBKUG04M', 5, 5, 5, 2, '5 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A707CUG20M', 'prod-26-a707cug20m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A707CUG20M referencia SKU A707CUG20M. Acabados de lujo y garantía de 6 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A707CUG20M', 5, 5, 5, 2, '6 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A709CUG01M', 'prod-27-a709cug01m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A709CUG01M referencia SKU A709CUG01M. Acabados de lujo y garantía de 7 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A709CUG01M', 5, 5, 5, 2, '7 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A706CUG04M', 'prod-28-a706cug04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A706CUG04M referencia SKU A706CUG04M. Acabados de lujo y garantía de 8 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A706CUG04M', 5, 5, 5, 2, '8 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A787P45M', 'prod-29-a787p45m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787P45M referencia SKU A787P45M. Acabados de lujo y garantía de 9 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 14, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787P45M', 5, 5, 4, 2, '9 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A739P429M', 'prod-30-a739p429m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A739P429M referencia SKU A739P429M. Acabados de lujo y garantía de 10 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A739P429M', 5, 5, 5, 2, '10 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A723P04M', 'prod-31-a723p04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A723P04M referencia SKU A723P04M. Acabados de lujo y garantía de 11 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 14, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A723P04M', 5, 5, 4, 2, '11 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A822P04M', 'prod-32-a822p04m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A822P04M referencia SKU A822P04M. Acabados de lujo y garantía de 12 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A822P04M', 5, 5, 5, 2, '12 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A544GGCBK18', 'prod-33-a544ggcbk18', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A544GGCBK18 referencia SKU A544GGCBK18. Acabados de lujo y garantía de 13 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A544GGCBK18', 5, 5, 5, 2, '13 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A787GGCBK09', 'prod-34-a787ggcbk09', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787GGCBK09 referencia SKU A787GGCBK09. Acabados de lujo y garantía de 14 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 14, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787GGCBK09', 5, 5, 4, 2, '14 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A787CMCM', 'prod-35-a787cmcm', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787CMCM referencia SKU A787CMCM. Acabados de lujo y garantía de 15 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787CMCM', 5, 5, 5, 2, '15 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A734CLKAM1840', 'prod-36-a734clkam1840', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A734CLKAM1840 referencia SKU A734CLKAM1840. Acabados de lujo y garantía de 16 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A734CLKAM1840', 5, 5, 5, 2, '16 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A787CDGRM', 'prod-37-a787cdgrm', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A787CDGRM referencia SKU A787CDGRM. Acabados de lujo y garantía de 17 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A787CDGRM', 5, 5, 5, 2, '17 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Lavamanos A712CA52M', 'prod-38-a712ca52m', 'Diseño Tu Espacio Collection', 'Pieza de autor Lavamanos A712CA52M referencia SKU A712CA52M. Acabados de lujo y garantía de 18 años.', 400000, 350000, 'Lavamanos', 'Contemporáneo', 15, '["/images/cat_mesa_1787548081162.jpg","/images/cat_mesa_portrait_1787589762766.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'A712CA52M', 5, 5, 5, 2, '18 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5523', 'prod-39-5523', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5523 referencia SKU 5523. Acabados de lujo y garantía de 19 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5523', 5, 4, 1, 1, '19 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos SF021', 'prod-40-sf021', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos SF021 referencia SKU SF021. Acabados de lujo y garantía de 20 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 5, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SF021', 2, 2, 1, 1, '20 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5814', 'prod-41-5814', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5814 referencia SKU 5814. Acabados de lujo y garantía de 21 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5814', 5, 3, 2, 1, '21 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5823', 'prod-42-5823', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5823 referencia SKU 5823. Acabados de lujo y garantía de 22 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5823', 4, 4, 2, 1, '22 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5822', 'prod-43-5822', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5822 referencia SKU 5822. Acabados de lujo y garantía de 23 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5822', 4, 4, 2, 1, '23 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5812', 'prod-44-5812', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5812 referencia SKU 5812. Acabados de lujo y garantía de 24 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5812', 4, 4, 2, 1, '24 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos SF021', 'prod-45-sf021', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos SF021 referencia SKU SF021. Acabados de lujo y garantía de 25 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 5, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SF021', 2, 2, 1, 1, '25 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5343', 'prod-46-5343', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5343 referencia SKU 5343. Acabados de lujo y garantía de 26 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5343', 3, 3, 4, 1, '26 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5911', 'prod-47-5911', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5911 referencia SKU 5911. Acabados de lujo y garantía de 27 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5911', 3, 3, 4, 1, '27 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5334', 'prod-48-5334', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5334 referencia SKU 5334. Acabados de lujo y garantía de 28 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5334', 3, 3, 4, 1, '28 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 6411', 'prod-49-6411', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 6411 referencia SKU 6411. Acabados de lujo y garantía de 29 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '6411', 3, 3, 4, 1, '29 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5322', 'prod-50-5322', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5322 referencia SKU 5322. Acabados de lujo y garantía de 30 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5322', 3, 3, 4, 1, '30 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5101', 'prod-51-5101', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5101 referencia SKU 5101. Acabados de lujo y garantía de 31 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5101', 3, 3, 4, 1, '31 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5512', 'prod-52-5512', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5512 referencia SKU 5512. Acabados de lujo y garantía de 32 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5512', 3, 3, 4, 1, '32 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos SF022', 'prod-53-sf022', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos SF022 referencia SKU SF022. Acabados de lujo y garantía de 33 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SF022', 3, 3, 4, 1, '33 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5519', 'prod-54-5519', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5519 referencia SKU 5519. Acabados de lujo y garantía de 34 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5519', 3, 3, 4, 1, '34 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5520', 'prod-55-5520', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5520 referencia SKU 5520. Acabados de lujo y garantía de 35 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5520', 3, 3, 4, 1, '35 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 6421', 'prod-56-6421', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 6421 referencia SKU 6421. Acabados de lujo y garantía de 36 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '6421', 3, 3, 4, 1, '36 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5521', 'prod-57-5521', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5521 referencia SKU 5521. Acabados de lujo y garantía de 37 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5521', 3, 3, 4, 1, '37 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos modernos 5351', 'prod-58-5351', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos modernos 5351 referencia SKU 5351. Acabados de lujo y garantía de 38 años.', 1000000, 980000, 'Espejos', 'Contemporáneo', 10, '["/images/lampara_bowie_1786563431628.jpg","/images/bowie_lifestyle_1786565071854.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', '5351', 3, 3, 4, 1, '38 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP120X900947', 'prod-59-hp120x900947', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900947 referencia SKU HP120X900947. Acabados de lujo y garantía de 38 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900947', 2, 2, 1, 1, '38 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP120X900948', 'prod-60-hp120x900948', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900948 referencia SKU HP120X900948. Acabados de lujo y garantía de 39 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900948', 2, 2, 1, 1, '39 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP120X900963', 'prod-61-hp120x900963', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900963 referencia SKU HP120X900963. Acabados de lujo y garantía de 40 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900963', 2, 2, 1, 1, '40 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP120X900964', 'prod-62-hp120x900964', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP120X900964 referencia SKU HP120X900964. Acabados de lujo y garantía de 41 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP120X900964', 2, 2, 1, 1, '41 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP70X1401465', 'prod-63-hp70x1401465', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP70X1401465 referencia SKU HP70X1401465. Acabados de lujo y garantía de 42 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP70X1401465', 2, 2, 1, 1, '42 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP50X1501546', 'prod-64-hp50x1501546', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP50X1501546 referencia SKU HP50X1501546. Acabados de lujo y garantía de 43 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP50X1501546', 2, 2, 1, 1, '43 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP80X801097', 'prod-65-hp80x801097', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801097 referencia SKU HP80X801097. Acabados de lujo y garantía de 44 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801097', 2, 2, 2, 1, '44 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP80X801098', 'prod-66-hp80x801098', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801098 referencia SKU HP80X801098. Acabados de lujo y garantía de 45 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801098', 2, 2, 2, 1, '45 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP80X801103', 'prod-67-hp80x801103', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801103 referencia SKU HP80X801103. Acabados de lujo y garantía de 46 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801103', 2, 2, 2, 1, '46 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP80X801104', 'prod-68-hp80x801104', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP80X801104 referencia SKU HP80X801104. Acabados de lujo y garantía de 47 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP80X801104', 2, 2, 2, 1, '47 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP100X1400921', 'prod-69-hp100x1400921', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP100X1400921 referencia SKU HP100X1400921. Acabados de lujo y garantía de 48 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP100X1400921', 2, 2, 1, 1, '48 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros HP100X1400923', 'prod-70-hp100x1400923', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros HP100X1400923 referencia SKU HP100X1400923. Acabados de lujo y garantía de 49 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'HP100X1400923', 2, 2, 1, 1, '49 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY78X781606', 'prod-71-gy78x781606', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY78X781606 referencia SKU GY78X781606. Acabados de lujo y garantía de 50 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY78X781606', 2, 2, 2, 1, '50 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY87X871608', 'prod-72-gy87x871608', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY87X871608 referencia SKU GY87X871608. Acabados de lujo y garantía de 51 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY87X871608', 2, 2, 2, 1, '51 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY50X1501601', 'prod-73-gy50x1501601', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY50X1501601 referencia SKU GY50X1501601. Acabados de lujo y garantía de 52 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY50X1501601', 2, 2, 2, 1, '52 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY50X1501604', 'prod-74-gy50x1501604', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY50X1501604 referencia SKU GY50X1501604. Acabados de lujo y garantía de 53 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY50X1501604', 2, 2, 2, 1, '53 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY77X1171589', 'prod-75-gy77x1171589', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY77X1171589 referencia SKU GY77X1171589. Acabados de lujo y garantía de 54 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 5, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY77X1171589', 2, 2, 1, 1, '54 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY77X1171593', 'prod-76-gy77x1171593', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY77X1171593 referencia SKU GY77X1171593. Acabados de lujo y garantía de 55 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY77X1171593', 2, 2, 2, 1, '55 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros GY77X1171594', 'prod-77-gy77x1171594', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros GY77X1171594 referencia SKU GY77X1171594. Acabados de lujo y garantía de 56 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 6, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'GY77X1171594', 2, 2, 2, 1, '56 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160045GD', 'prod-78-ah60160045gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160045GD referencia SKU AH60160045GD. Acabados de lujo y garantía de 57 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160045GD', 3, 3, 4, 1, '57 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160045BK', 'prod-79-ah60160045bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160045BK referencia SKU AH60160045BK. Acabados de lujo y garantía de 58 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160045BK', 3, 3, 4, 1, '58 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros SWR80070', 'prod-80-swr80070', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros SWR80070 referencia SKU SWR80070. Acabados de lujo y garantía de 59 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'SWR80070', 3, 3, 4, 1, '59 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60120040', 'prod-81-ah60120040', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120040 referencia SKU AH60120040. Acabados de lujo y garantía de 60 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120040', 3, 3, 4, 1, '60 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60120043', 'prod-82-ah60120043', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120043 referencia SKU AH60120043. Acabados de lujo y garantía de 61 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120043', 3, 3, 4, 1, '61 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60120037BK', 'prod-83-ah60120037bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120037BK referencia SKU AH60120037BK. Acabados de lujo y garantía de 62 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120037BK', 3, 3, 4, 1, '62 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60120037GD', 'prod-84-ah60120037gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60120037GD referencia SKU AH60120037GD. Acabados de lujo y garantía de 63 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60120037GD', 3, 3, 4, 1, '63 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160051BK', 'prod-85-ah60160051bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160051BK referencia SKU AH60160051BK. Acabados de lujo y garantía de 64 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160051BK', 3, 3, 4, 1, '64 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160051GD', 'prod-86-ah60160051gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160051GD referencia SKU AH60160051GD. Acabados de lujo y garantía de 65 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160051GD', 3, 3, 4, 1, '65 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160050BK', 'prod-87-ah60160050bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160050BK referencia SKU AH60160050BK. Acabados de lujo y garantía de 66 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160050BK', 3, 3, 4, 1, '66 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160050GD', 'prod-88-ah60160050gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160050GD referencia SKU AH60160050GD. Acabados de lujo y garantía de 67 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160050GD', 3, 3, 4, 1, '67 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AHR80001', 'prod-89-ahr80001', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AHR80001 referencia SKU AHR80001. Acabados de lujo y garantía de 68 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AHR80001', 3, 3, 4, 1, '68 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AHR80006GD', 'prod-90-ahr80006gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AHR80006GD referencia SKU AHR80006GD. Acabados de lujo y garantía de 69 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AHR80006GD', 3, 3, 4, 1, '69 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AHR80006BK', 'prod-91-ahr80006bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AHR80006BK referencia SKU AHR80006BK. Acabados de lujo y garantía de 70 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AHR80006BK', 3, 3, 4, 1, '70 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160022BK', 'prod-92-ah60160022bk', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160022BK referencia SKU AH60160022BK. Acabados de lujo y garantía de 71 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160022BK', 3, 3, 4, 1, '71 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Espejos y cuadros AH60160022GD', 'prod-93-ah60160022gd', 'Diseño Tu Espacio Collection', 'Pieza de autor Espejos y cuadros AH60160022GD referencia SKU AH60160022GD. Acabados de lujo y garantía de 72 años.', 1500000, 750000, 'Cuadros & Espejos', 'Contemporáneo', 10, '["/images/cat_pie_1787548052523.jpg","/images/cat_pie_portrait_1787589741558.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'AH60160022GD', 3, 3, 4, 1, '72 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone)', 'prod-94-flexiblestonepanelstartmoonstone', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Startmoon stone) Flexible-Stone-Panel -(Startmoon stone) referencia SKU Flexible-Stone-Panel -(Startmoon stone). Acabados de lujo y garantía de 70 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel -(Startmoon stone)', 20, 20, 10, 5, '70 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving)', 'prod-95-flexiblestonepanelweaving', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Weaving) Flexible-Stone-Panel-(Weaving) referencia SKU Flexible-Stone-Panel-(Weaving). Acabados de lujo y garantía de 71 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Weaving)', 20, 20, 10, 5, '71 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board)', 'prod-96-flexiblestonepanellinestoneboard', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Line stone board) Flexible-Stone-Panel-(Line stone board) referencia SKU Flexible-Stone-Panel-(Line stone board). Acabados de lujo y garantía de 72 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Line stone board)', 20, 20, 10, 5, '72 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3', 'prod-97-travertineflexiblestonepaneltravertine3', 'Diseño Tu Espacio Collection', 'Pieza de autor Travertine Flexible Stone Panel（Travertine)-3 Travertine-Flexible-Stone-Panel-(Travertine)-3 referencia SKU Travertine-Flexible-Stone-Panel-(Travertine)-3. Acabados de lujo y garantía de 73 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Travertine-Flexible-Stone-Panel-(Travertine)-3', 20, 20, 10, 5, '73 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2', 'prod-98-flexiblestonepaneltravertine2', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel（Travertine)-2 Flexible-Stone Panel-(Travertine)-2 referencia SKU Flexible-Stone Panel-(Travertine)-2. Acabados de lujo y garantía de 74 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone Panel-(Travertine)-2', 20, 20, 10, 5, '74 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1', 'prod-99-flexiblestonepaneltravertine1', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel（Travertine)-1 Flexible-Stone-Panel-(Travertine)-1 referencia SKU Flexible-Stone-Panel-(Travertine)-1. Acabados de lujo y garantía de 75 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Travertine)-1', 20, 20, 10, 5, '75 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone)', 'prod-100-flexiblestonepanelsquarelinestone', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Square line stone) Flexible-Stone-Panel-(Square line stone) referencia SKU Flexible-Stone-Panel-(Square line stone). Acabados de lujo y garantía de 76 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Square line stone)', 20, 20, 10, 5, '76 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate)', 'prod-101-flexiblestonepanelslate', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel（Slate) Flexible-Stone-Panel-(Slate) referencia SKU Flexible-Stone-Panel-(Slate). Acabados de lujo y garantía de 77 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Slate)', 20, 20, 10, 5, '77 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

INSERT INTO products (
  name, slug, brand_collection, description, price, original_price, category, style, stock, images, colors, is_featured, dimensions, materials, sku, warehouse_stock, store_stock, web_stock, boxes_count, warranty, inventory_status
) VALUES (
  'Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone)', 'prod-102-flexiblestonepanelrockcutstone', 'Diseño Tu Espacio Collection', 'Pieza de autor Flexible Stone Panel (Rockcut Stone) Flexible-Stone-Panel-(Rockcut Stone) referencia SKU Flexible-Stone-Panel-(Rockcut Stone). Acabados de lujo y garantía de 78 años.', 1200000, 750000, 'Revestimientos', 'Contemporáneo', 50, '["/images/cat_techo_1787548027809.jpg","/images/cat_techo_portrait_1787589732026.jpg"]'::jsonb, '[{"name":"Latón Dorado","hex":"#CDB375"},{"name":"Plata Níquel","hex":"#D4D4D2"},{"name":"Negro Mate","hex":"#1C1C1C"}]'::jsonb, false, 'Estándar Arquitectónico', 'Materiales de Alta Gama', 'Flexible-Stone-Panel-(Rockcut Stone)', 20, 20, 10, 5, '78 años', 'Disponible'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  warehouse_stock = EXCLUDED.warehouse_stock,
  store_stock = EXCLUDED.store_stock,
  web_stock = EXCLUDED.web_stock,
  boxes_count = EXCLUDED.boxes_count,
  warranty = EXCLUDED.warranty,
  inventory_status = EXCLUDED.inventory_status;

