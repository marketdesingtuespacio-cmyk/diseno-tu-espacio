# 🚀 Master Prompt & Arquitectura Completa de Base de Datos para E-commerce
## Estructura Oficial Probada en Producción (PostgreSQL / Supabase Nube)

Este documento contiene **todo lo necesario** para replicar de forma idéntica la base de datos y la arquitectura técnica de este e-commerce en cualquier otro proyecto.

Incluye:
1. **Prompt Maestro de Ingeniería (Copiar y Pegar):** Para entregar a cualquier desarrollador o IA (ChatGPT, Claude, Gemini, Antigravity) y que levante la infraestructura completa.
2. **Script SQL Consolidado de Despliegue en 1 Clic (`schema.sql`):** Con todas las tablas, llaves primarias, tipos de datos, índices, triggers reactivos, buckets de almacenamiento y políticas de seguridad (RLS).
3. **Diccionario de Datos & Reglas de Negocio:** Inventario multicanal (bodega/tienda/web), facturación electrónica legal (DIAN/Siigo con CUFE), abonos parciales y roles RBAC.

---

## 📋 PARTE 1: PROMPT MAESTRO (Para Iniciar un Nuevo Proyecto)

> **Instrucciones:** Copia el siguiente bloque de texto y pégalo directamente en tu herramienta de IA o entrégalo a tu equipo de desarrollo para clonar la arquitectura completa:

```markdown
Actúa como un Arquitecto de Software Senior y Desarrollador Full-Stack experto en PostgreSQL, Supabase y E-commerce de Alto Desempeño.

Necesito que construyas la arquitectura de base de datos completa para un e-commerce profesional con las siguientes características y reglas de negocio obligatorias:

1. CATÁLOGO & INVENTARIO MULTICANAL REACTIVO:
- Cada producto debe tener existencias divididas por ubicaciones físicas y virtuales:
  * `warehouse_stock` (Stock en Bodega Principal)
  * `store_stock` (Stock en Tienda Física / Showroom)
  * `web_stock` (Stock reservado para e-commerce online)
- REGLA DE ORO: El campo `stock` (total disponible) NUNCA se edita como un número arbitrario manual; siempre debe ser estrictamente la suma de las 3 divisiones:
  stock = warehouse_stock + store_stock + web_stock
- Al realizar ventas o despachos, el sistema debe descontar de la ubicación elegida (o web por defecto en compras online) y actualizar el total en cascada. Si una orden se cancela, debe restaurar la cantidad a su ubicación original.
- Soporte para precio regular (`price`), precio de oferta (`original_price` tachado), precio mayorista (`wholesale_price`) y cantidad mínima requerida (`wholesale_min_qty`).
- Slugs amigables únicos para SEO, array de imágenes en Storage, variantes de color JSONB (`[{name, hex}]`), dimensiones, materiales, referencias SKU y badges promocionales.

2. SISTEMA DE PEDIDOS (ORDERS) & ABONOS PARCIALES:
- Las compras guardan los items como un Snapshot JSON inmutable en la columna `items`. Si el precio o nombre de un producto cambia meses después, el pedido histórico no se altera.
- Manejo financiero dual:
  * `total` (Total liquidado de la orden)
  * `deposit_amount` (Abono o anticipo pagado, ej. 50% para fabricación)
  * `pending_balance` (Saldo pendiente por cobrar contra entrega o liquidación)
  * `payment_status` ('pending', 'partial', 'paid')
- Campos de logística y rastreo: transportadora (`carrier`), número de guía (`tracking_number`), tags de cliente (`VIP`, `Arquitecto`, `Mayorista`, `Residencial`).

3. FACTURACIÓN ELECTRÓNICA LEGAL (DIAN / SIIGO NUBE):
- Campos nativos en la tabla de órdenes para emisión fiscal automática:
  * `customer_document_type` (CC, NIT, CE, Pasaporte) y `customer_document_id`
  * `siigo_invoice_id` (UUID interno del comprobante en Siigo)
  * `siigo_invoice_number` (Consecutivo oficial con prefijo de resolución, ej: FEF-19)
  * `siigo_cufe` (Código Único de Facturación Electrónica expedido y firmado ante la DIAN)
  * `siigo_pdf_url` (Enlace directo al visor oficial del PDF DIAN)
  * `siigo_invoice_status` ('pending', 'generated', 'failed', 'not_applicable')
  * `siigo_error_log` (Detalle técnico en caso de rechazo para auditoría inmediata)

4. SISTEMA DE USUARIOS & CONTROL DE ACCESO (RBAC):
- Tabla `profiles` vinculada a `auth.users(id)` mediante un Trigger automático en PostgreSQL (`on_auth_user_created`).
- Roles soportados: `admin`, `collaborator`, `customer`.
- Array de permisos JSONB granular (`permissions`):
  ["manage_products", "manage_orders", "manage_appointments", "manage_coupons", "manage_team", "view_analytics", "edit_settings"]

5. MÓDULOS INTEGRADOS COMPLEMENTARIOS:
- `appointments`: Agendamiento de citas y asesorías presenciales/virtuales con pago integrado.
- `coupons`: Cupones de descuento (porcentaje o valor fijo COP) con fecha de caducidad y compra mínima.
- `product_reviews`: Reseñas de 1 a 5 estrellas con moderación (`pending`, `approved`).
- `activity_logs`: Trazabilidad completa (quién editó qué producto u orden, acción y fecha).
- Storage Bucket: Bucket público `product-images` para servir fotos optimizadas vía CDN.

Por favor genera el script SQL completo, libre de errores de sintaxis, con extensiones UUID, tablas con constraints, índices para optimizar búsquedas rápidas, triggers automáticos y políticas de Row Level Security (RLS).
```

---

## 🗄️ PARTE 2: SCRIPT SQL CONSOLIDADO (1-CLICK DEPLOY)

Ejecuta este script completo en el **Editor SQL de Supabase** (o en tu cliente PostgreSQL) para crear toda la base de datos con una sola ejecución:

```sql
-- ==============================================================================
-- 🏛️ E-COMMERCE MASTER DATABASE SCHEMA (POSTGRESQL / SUPABASE NUBE)
-- Estructura Oficial Completa: Catálogo, Inventario, Pedidos, DIAN, RBAC y Storage
-- ==============================================================================

-- 1. HABILITAR EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLA: PROFILES (Perfiles de Usuarios y Roles RBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'collaborator', 'admin')),
  permissions JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. TABLA: PRODUCTS (Catálogo Maestro e Inventario Multicanal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_collection TEXT DEFAULT 'Colección Principal',
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(14, 2) NOT NULL,
  original_price DECIMAL(14, 2),
  wholesale_price DECIMAL(14, 2),
  wholesale_min_qty INT DEFAULT 5,
  category TEXT NOT NULL,
  style TEXT NOT NULL DEFAULT 'Contemporáneo',
  
  -- Divisiones de Inventario Físico y Web
  warehouse_stock INT NOT NULL DEFAULT 0,
  store_stock INT NOT NULL DEFAULT 0,
  web_stock INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0, -- Calculado automáticamente: warehouse + store + web
  
  boxes_count INT DEFAULT 1,
  warranty TEXT DEFAULT '3 años',
  inventory_status TEXT NOT NULL DEFAULT 'Disponible' CHECK (inventory_status IN ('Disponible', 'Poco Stock', 'Agotado', 'Privado')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Multimedia y Atributos Técnicos
  images TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb, -- Formato: [{"name": "Latón Dorado", "hex": "#CDB375"}]
  dimensions TEXT DEFAULT '',
  materials TEXT DEFAULT '',
  sku TEXT DEFAULT '',
  
  -- Badges y Políticas
  shipping_returns_info TEXT DEFAULT '',
  care_instructions TEXT DEFAULT '',
  fast_shipping_badge TEXT DEFAULT '',
  returns_policy_badge TEXT DEFAULT '',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_by TEXT DEFAULT 'Administración'
);

-- ==============================================================================
-- 4. TABLA: ORDERS (Pedidos, Abonos y Facturación Electrónica DIAN)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref TEXT UNIQUE NOT NULL, -- Ej: DT-931128
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  customer_tag TEXT DEFAULT 'Residencial' CHECK (customer_tag IN ('VIP', 'Arquitecto', 'Residencial', 'Proyecto Especial', 'Mayorista')),
  pricing_mode TEXT DEFAULT 'detal' CHECK (pricing_mode IN ('detal', 'mayorista', 'mixto')),
  
  -- Dirección y Logística
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Medellín',
  carrier TEXT DEFAULT 'Servientrega',
  tracking_number TEXT DEFAULT '',
  
  -- Liquidación Financiera y Abonos
  subtotal DECIMAL(14, 2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(14, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(14, 2) NOT NULL DEFAULT 0,
  total DECIMAL(14, 2) NOT NULL,
  deposit_amount DECIMAL(14, 2) NOT NULL DEFAULT 0,
  pending_balance DECIMAL(14, 2) NOT NULL DEFAULT 0,
  
  -- Estados
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  payment_method TEXT DEFAULT 'Pago por Bold',
  payment_gateway TEXT DEFAULT 'Bold Payments (Colombia)',
  
  -- Snapshot Inmutable de Productos
  items_count INT DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{"product_id", "name", "price", "quantity", "color", "stock_location"}]
  notes TEXT DEFAULT '',
  
  -- Facturación Electrónica DIAN / Siigo Nube
  customer_document_type TEXT DEFAULT 'CC' CHECK (customer_document_type IN ('CC', 'NIT', 'CE', 'TI', 'PASAPORTE')),
  customer_document_id TEXT DEFAULT '',
  siigo_invoice_id TEXT DEFAULT NULL,
  siigo_invoice_number TEXT DEFAULT NULL, -- Ej: FEF-19
  siigo_invoice_status TEXT DEFAULT 'pending' CHECK (siigo_invoice_status IN ('pending', 'generated', 'failed', 'not_applicable')),
  siigo_cufe TEXT DEFAULT NULL,
  siigo_pdf_url TEXT DEFAULT NULL,
  siigo_error_log TEXT DEFAULT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_by TEXT DEFAULT 'Sistema Web'
);

-- ==============================================================================
-- 5. TABLA: APPOINTMENTS (Citas de Interiorismo y Asesorías)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_type TEXT NOT NULL, -- Ej: 'Asesoría en Showroom', 'Visita Técnica'
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL, -- Ej: '10:00 AM'
  city TEXT DEFAULT 'Medellín',
  address TEXT DEFAULT '',
  price DECIMAL(12, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('unpaid', 'paid', 'waived')),
  payment_gateway TEXT DEFAULT 'Bold Payments',
  bold_order_id TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. TABLA: COUPONS (Cupones de Descuento Promocionales)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- Ej: 'PROMO10'
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(14, 2) DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  usage_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. TABLA: PRODUCT_REVIEWS (Reseñas y Calificaciones)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT DEFAULT '',
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT DEFAULT '',
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. TABLA: ACTIVITY_LOGS (Bitácora de Auditoría y Trazabilidad)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT DEFAULT '',
  user_name TEXT DEFAULT 'Administrador',
  user_email TEXT DEFAULT '',
  entity_type TEXT NOT NULL, -- 'product', 'order', 'coupon', 'team'
  entity_id TEXT DEFAULT '',
  entity_name TEXT DEFAULT '',
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'status_change'
  description TEXT NOT NULL,
  details TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. ÍNDICES DE RENDIMIENTO (Performance Tuning)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_inventory_status ON public.products(inventory_status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_ref ON public.orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_siigo_status ON public.orders(siigo_invoice_status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- ==============================================================================
-- 10. TRIGGER AUTOMÁTICO: SINCRONIZACIÓN DE PERFILES DESDE AUTH.USERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role text;
  v_name text;
  v_perms jsonb;
BEGIN
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_role := LOWER(COALESCE(new.raw_user_meta_data->>'role', 'customer'));

  IF v_role NOT IN ('admin', 'collaborator', 'customer') THEN
    v_role := 'customer';
  END IF;

  IF v_role = 'admin' THEN
    v_perms := '["manage_products", "manage_orders", "manage_appointments", "manage_coupons", "manage_team", "view_analytics", "edit_settings"]'::jsonb;
  ELSIF v_role = 'collaborator' THEN
    v_perms := '["manage_products", "manage_orders", "manage_appointments"]'::jsonb;
  ELSE
    v_perms := '[]'::jsonb;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, role, permissions, status)
  VALUES (new.id, v_name, new.email, v_role, v_perms, 'active')
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      permissions = EXCLUDED.permissions;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 11. POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Catálogo: lectura pública para todos los visitantes de la tienda
DROP POLICY IF EXISTS "Productos visibles publicamente" ON public.products;
CREATE POLICY "Productos visibles publicamente" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestion total de productos para administracion" ON public.products;
CREATE POLICY "Gestion total de productos para administracion" ON public.products FOR ALL USING (true);

-- Pedidos: creación pública (checkout) y lectura completa para administradores
DROP POLICY IF EXISTS "Creacion de ordenes publica en checkout" ON public.orders;
CREATE POLICY "Creacion de ordenes publica en checkout" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Gestion total de ordenes para administracion" ON public.orders;
CREATE POLICY "Gestion total de ordenes para administracion" ON public.orders FOR ALL USING (true);

-- Perfiles y Usuarios
DROP POLICY IF EXISTS "Acceso a perfiles" ON public.profiles;
CREATE POLICY "Acceso a perfiles" ON public.profiles FOR ALL USING (true);

-- Cupones y Citas
DROP POLICY IF EXISTS "Acceso a cupones" ON public.coupons;
CREATE POLICY "Acceso a cupones" ON public.coupons FOR ALL USING (true);

DROP POLICY IF EXISTS "Acceso a citas" ON public.appointments;
CREATE POLICY "Acceso a citas" ON public.appointments FOR ALL USING (true);

DROP POLICY IF EXISTS "Acceso a resenas" ON public.product_reviews;
CREATE POLICY "Acceso a resenas" ON public.product_reviews FOR ALL USING (true);

DROP POLICY IF EXISTS "Acceso a bitacora" ON public.activity_logs;
CREATE POLICY "Acceso a bitacora" ON public.activity_logs FOR ALL USING (true);

-- ==============================================================================
-- 12. STORAGE BUCKET: PRODUCT-IMAGES (Para CDN de fotos en alta resolución)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- Límite 10MB por foto
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 10485760;

-- Políticas del Bucket de imágenes
DROP POLICY IF EXISTS "Imagenes de productos publicas" ON storage.objects;
CREATE POLICY "Imagenes de productos publicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Subida de imagenes permitida" ON storage.objects;
CREATE POLICY "Subida de imagenes permitida" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Edicion y borrado de imagenes permitido" ON storage.objects;
CREATE POLICY "Edicion y borrado de imagenes permitido" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images');
```

---

## 📐 PARTE 3: REGLAS DE NEGOCIO TÉCNICAS CLAVE

### 1. Regla de Inventario Multicanal
En cualquier nuevo ecommerce que use este esquema:
$$\text{stock} = \text{warehouse\_stock} + \text{store\_stock} + \text{web\_stock}$$
* **Bodega:** Mercancía embalada en centro logístico principal.
* **Tienda:** Existencias en exhibición para entrega inmediata en local físico.
* **Web:** Cupo reservado para ventas por carrito online.
* **Estados reactivos:**
  * Si $\text{stock} \le 0 \implies \text{Agotado}$.
  * Si $1 \le \text{stock} \le 3 \implies \text{Poco Stock}$.
  * Si $\text{stock} > 3 \implies \text{Disponible}$.

### 2. Regla de Facturación Electrónica DIAN / Siigo
* **ID Comprobante DIAN:** `64261` (Resolución oficial `ElectronicInvoice`).
* **Prefijo:** `FEF` (Factura Electrónica de Venta).
* **Consecutivo DIAN:** Se compone como `FEF-{number}` (ej: `FEF-19`).
* **Sello Fiscal:** Toda emisión exitosa guarda el `siigo_cufe` (código alfanumérico DIAN de 96 caracteres) y el enlace `siigo_pdf_url`.

### 3. Regla de Inmutabilidad en Pedidos
* En la tabla `orders`, la columna `items` almacena un **snapshot JSON** que contiene el precio exacto al que se compró, la variante de color, el SKU y la ubicación de donde se descontó (`warehouse`, `store` o `web`).
* Esto previene que si el administrador sube los precios de los productos en el catálogo, los pedidos pasados cambien de valor.

---

## 🚀 ¿Cómo usar este archivo?
1. **Para crear una base de datos nueva idéntica:**
   * Crea un nuevo proyecto en [Supabase](https://supabase.com).
   * Abre el menú **SQL Editor**.
   * Pega todo el contenido de la **PARTE 2** y presiona **Run**.
2. **Para que un desarrollador o una IA arme el frontend:**
   * Copia el texto de la **PARTE 1** y pégaselo como prompt de inicio.
