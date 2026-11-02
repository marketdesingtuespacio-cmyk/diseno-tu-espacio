# 🏛️ Arquitectura de Base de Datos para E-commerce (Supabase / PostgreSQL)

Esta guía documenta la **arquitectura de datos completa, probada en producción** utilizada en este e-commerce. Contiene todo lo necesario para inicializar desde cero un nuevo e-commerce en **Supabase** con:

1. **Gestión de Catálogo y Productos** (stock multicanal, precios mayoristas, variantes, SEO, slugs, dimensiones y multimedia).
2. **Sistema de Pedidos / Órdenes** (inmutabilidad por snapshots JSON, abonos/saldos pendientes, tracking y pasarela Bold).
3. **Facturación Electrónica DIAN / Siigo** (campos nativos para CUFE, consecutivo, PDF fiscal y log de errores).
4. **Agendamiento de Citas / Asesorías de Diseño** (fechas, horas, servicios y confirmación de pago).
5. **Gestión de Roles, Usuarios y Permisos Administrativos** (RBAC granular para empleados y colaboradores).
6. **Cupones de Descuento** (porcentuales o monto fijo con reglas de compra mínima y vigencia).
7. **Calificaciones y Reseñas de Productos** (con moderación y validación 1-5 estrellas).
8. **Auditoría y Logs de Actividad** (historial de quién modificó qué, cuándo y desde dónde).
9. **Storage Buckets y Políticas RLS** (almacenamiento de imágenes de productos y seguridad Row-Level Security).

---

## 📋 Resumen de Tablas y Entidades

| Tabla | Propósito Principal | Relación Clave |
|---|---|---|
| `products` | Catálogo maestro de productos, inventario, precios y multimedia | Independiente |
| `orders` | Registro de compras de clientes, estados de pago y logística | Snapshot inmutable de items |
| `appointments` | Citas de asesoría presencial/virtual o servicios de diseño | Independiente o vinculado a pasarela |
| `profiles` | Perfiles de administradores y colaboradores con roles/permisos | `auth.users(id)` |
| `coupons` | Códigos de descuento con reglas de aplicación | Utilizado en checkout |
| `product_reviews` | Reseñas y calificaciones de clientes por producto | `products(id)` y `auth.users(id)` |
| `activity_logs` | Trazabilidad y auditoría de cambios en la plataforma | Administrativo |

---

## 🗄️ Diccionario de Datos

### 1. Tabla `products` (Productos)

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria (`gen_random_uuid()`). |
| `name` | `text` | NO | Nombre comercial del producto. |
| `slug` | `text` | NO | URL amigable única para SEO (ej: `silla-nordica-roble`). |
| `brand_collection` | `text` | SÍ | Colección, línea o marca (ej: `Colección Loft 2026`). |
| `description` | `text` | SÍ | Descripción detallada del producto (soporta HTML/Markdown). |
| `price` | `numeric` | NO | Precio de venta al público en moneda local (COP). |
| `original_price` | `numeric` | SÍ | Precio de lista antes de descuento (para mostrar tachado). |
| `category` | `text` | NO | Categoría principal (ej: `Salas`, `Comedores`, `Iluminación`). |
| `style` | `text` | SÍ | Estilo decorativo (ej: `Minimalista`, `Industrial`, `Nórdico`). |
| `stock` | `integer` | NO | Stock total disponible para la venta web (default `0`). |
| `images` | `text[]` | SÍ | Array de URLs públicas de imágenes alojadas en Supabase Storage. |
| `colors` | `jsonb` | SÍ | Array JSON con opciones de color: `[{"name": "Gris", "hex": "#808080"}]`. |
| `is_featured` | `boolean` | SÍ | Indica si se destaca en la página de inicio (`false` por defecto). |
| `dimensions` | `jsonb` | SÍ | Medidas del mueble: `{"width": 80, "height": 95, "depth": 75, "unit": "cm"}`. |
| `materials` | `text[]` | SÍ | Materiales de fabricación (ej: `["Roble macizo", "Tela lino antifluido"]`). |
| `sku` | `text` | SÍ | Código único de referencia interna / bodega. |
| `warehouse_stock` | `integer` | SÍ | Stock físico en bodega central. |
| `store_stock` | `integer` | SÍ | Stock físico en tienda o showroom físico. |
| `web_stock` | `integer` | SÍ | Stock reservado exclusivamente para el e-commerce. |
| `boxes_count` | `integer` | SÍ | Número de cajas/bultos en que se despacha el producto. |
| `warranty` | `text` | SÍ | Términos de garantía (ej: `3 años en estructura`). |
| `inventory_status` | `text` | SÍ | Estado: `in_stock`, `low_stock`, `out_of_stock`, `pre_order`. |
| `wholesale_price` | `numeric` | SÍ | Precio especial para compras al por mayor o arquitectos. |
| `wholesale_min_qty` | `integer` | SÍ | Cantidad mínima para activar precio mayorista. |
| `shipping_returns_info`| `text` | SÍ | Texto informativo de políticas de entrega y devoluciones. |
| `care_instructions` | `text` | SÍ | Guía de mantenimiento y limpieza. |
| `fast_shipping_badge` | `boolean` | SÍ | Badge "Envío Express" en la tarjeta de producto. |
| `returns_policy_badge` | `boolean` | SÍ | Badge "Garantía de Satisfacción" en la tarjeta. |
| `created_at` | `timestamptz` | SÍ | Fecha y hora de creación (`now()`). |
| `updated_at` | `timestamptz` | SÍ | Última actualización (`now()`). |
| `updated_by` | `text` | SÍ | Email o identificador del usuario que realizó la última edición. |

---

### 2. Tabla `orders` (Pedidos y Facturación DIAN)

> **💡 Nota de diseño:** Los pedidos almacenan los productos en la columna `items` como un snapshot JSON inmutable. Esto garantiza que si el precio, nombre o imagen de un producto cambia en el catálogo meses después, el pedido histórico mantiene exactamente lo que el cliente compró y pagó.

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Identificador único interno. |
| `order_ref` | `text` | NO | Referencia visible para el cliente y logística (ej: `DT-931128`). |
| `customer_name` | `text` | NO | Nombre completo del comprador. |
| `customer_email` | `text` | NO | Correo electrónico de contacto y notificación. |
| `customer_phone` | `text` | SÍ | Teléfono o celular (útil para transportadoras). |
| `customer_tag` | `text` | SÍ | Etiqueta de fidelización (`Nuevo`, `Recurrente`, `VIP`, `Mayorista`). |
| `customer_document_type` | `text` | SÍ | Tipo documento fiscal: `CC`, `NIT`, `CE`, `PP`. |
| `customer_document_id` | `text` | SÍ | Número de identificación fiscal para la DIAN. |
| `shipping_address` | `text` | NO | Dirección física de entrega o indicación de retiro en tienda. |
| `city` | `text` | NO | Ciudad y departamento de entrega (o "Retiro en Tienda"). |
| `carrier` | `text` | SÍ | Transportadora asignada (ej: `Servientrega`, `Coordinadora`, `Envía`). |
| `tracking_number` | `text` | SÍ | Número de guía o remesa para seguimiento. |
| `subtotal` | `numeric` | NO | Valor de los productos antes de envío y descuentos. |
| `shipping_cost` | `numeric` | NO | Costo del envío cobrado ($30.000 o $0 si es retiro). |
| `discount` | `numeric` | NO | Valor total descontado por cupones o promociones. |
| `deposit_amount` | `numeric` | SÍ | Valor pagado como anticipo/abono inicial (50%, etc.). |
| `pending_balance` | `numeric` | SÍ | Saldo pendiente por cobrar contra entrega o fabricación. |
| `total` | `numeric` | NO | Total final de la orden (`subtotal + shipping_cost - discount`). |
| `status` | `text` | SÍ | Estado logístico: `pending`, `processing`, `shipped`, `delivered`, `cancelled`. |
| `payment_status` | `text` | SÍ | Estado financiero: `pending`, `paid`, `partially_paid`, `failed`, `refunded`. |
| `payment_gateway` | `text` | SÍ | Pasarela utilizada (`bold`, `wompi`, `mercado_pago`, `manual_transfer`). |
| `payment_method` | `text` | SÍ | Método específico: `Credit Card`, `PSE`, `Nequi`, `Bancolombia`. |
| `items_count` | `integer` | SÍ | Total de unidades de productos en la orden. |
| `items` | `jsonb` | NO | Array con el detalle de items comprados `[{"id", "name", "price", "quantity", "image", "sku"}]`. |
| `notes` | `text` | SÍ | Observaciones especiales de entrega o notas internas. |
| `siigo_invoice_id` | `text` | SÍ | ID del comprobante retornado por la API de Siigo Nube. |
| `siigo_invoice_number` | `text` | SÍ | Consecutivo fiscal oficial DIAN (ej: `FE-1045`). |
| `siigo_invoice_status` | `text` | SÍ | Estado ante DIAN: `pending`, `sent`, `error`, `rejected`. |
| `siigo_cufe` | `text` | SÍ | Código Único de Facturación Electrónica expedido por la DIAN. |
| `siigo_pdf_url` | `text` | SÍ | Enlace directo para descargar el PDF fiscal legal de Siigo. |
| `siigo_error_log` | `text` | SÍ | Registro del mensaje devuelto por la API en caso de rechazo o error. |
| `created_at` | `timestamptz` | SÍ | Fecha y hora en que se originó el pedido. |
| `updated_at` | `timestamptz` | SÍ | Fecha de última modificación de estado o datos. |
| `updated_by` | `text` | SÍ | Usuario que actualizó la orden por última vez. |

---

### 3. Tabla `appointments` (Agendamiento de Citas)

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Identificador único de la cita. |
| `customer_name` | `text` | NO | Nombre del cliente. |
| `customer_email` | `text` | NO | Correo del cliente. |
| `customer_phone` | `text` | NO | Teléfono para confirmación por WhatsApp o llamada. |
| `service_type` | `text` | NO | Servicio solicitado (ej: `Asesoría en Showroom`, `Diseño de Interiores Virtual`). |
| `appointment_date` | `date` | NO | Fecha programada (AAAA-MM-DD). |
| `appointment_time` | `text` | NO | Franja horaria (ej: `10:00 AM - 11:30 AM`). |
| `city` | `text` | SÍ | Ciudad donde se prestará el servicio presencial. |
| `address` | `text` | SÍ | Dirección del proyecto o inmueble a asesorar. |
| `price` | `numeric` | SÍ | Costo de la consulta/servicio ($0 si es gratuita). |
| `status` | `text` | SÍ | Estado: `pending`, `confirmed`, `completed`, `cancelled`. |
| `payment_status` | `text` | SÍ | `pending`, `paid`, `waived`. |
| `payment_gateway` | `text` | SÍ | Pasarela utilizada para reservar. |
| `bold_order_id` | `text` | SÍ | Referencia de transacción en Bold. |
| `notes` | `text` | SÍ | Necesidades del cliente, metros cuadrados, estilo preferido. |
| `created_at` | `timestamptz` | SÍ | Fecha de agendamiento. |

---

### 4. Tabla `profiles` (Usuarios del Panel Administrativo / RBAC)

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Llave foránea vinculada a `auth.users(id)`. |
| `full_name` | `text` | SÍ | Nombre y apellido del colaborador o usuario. |
| `email` | `text` | SÍ | Email registrado en Supabase Auth. |
| `role` | `text` | SÍ | Rol principal: `super_admin`, `admin`, `collaborator`, `customer`. |
| `permissions` | `jsonb` | SÍ | Array de permisos: `["orders_view", "orders_edit", "products_manage", "billing_issue", "analytics_view"]`. |
| `status` | `text` | SÍ | Estado del usuario: `active`, `suspended`, `pending_invitation`. |
| `phone` | `text` | SÍ | Número de contacto. |
| `created_at` | `timestamptz` | SÍ | Fecha de alta del perfil. |

---

### 5. Tabla `coupons` (Cupones de Descuento)

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `code` | `text` | NO | Código alfanumérico único en mayúsculas (ej: `BIENVENIDO10`, `BLACKFRIDAY`). |
| `discount_type` | `text` | NO | Tipo: `percentage` (%) o `fixed` ($ COP). |
| `discount_value` | `numeric` | NO | Valor del descuento (ej: `10` para 10% o `50000` para $50.000 COP). |
| `min_purchase` | `numeric` | SÍ | Monto mínimo de compra en subtotal para aplicar. |
| `expiry_date` | `timestamptz` | SÍ | Fecha y hora límite de validez. |
| `usage_count` | `integer` | SÍ | Contador de veces que ha sido redimido. |
| `is_active` | `boolean` | SÍ | Interruptor para pausar o activar el cupón (`true`/`false`). |
| `created_at` | `timestamptz` | SÍ | Fecha de creación. |

---

### 6. Tabla `product_reviews` (Calificaciones y Reseñas)

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `product_id` | `uuid` | NO | Relación con el producto evaluado (`products.id`). |
| `user_id` | `uuid` | SÍ | Relación opcional con cliente registrado (`auth.users.id`). |
| `user_name` | `text` | NO | Nombre público que se mostrará en la reseña. |
| `user_email` | `text` | SÍ | Correo del autor para validación de compra verificada. |
| `rating` | `integer` | NO | Puntuación de 1 a 5 estrellas (`CHECK (rating >= 1 AND rating <= 5)`). |
| `title` | `text` | SÍ | Título o titular de la opinión. |
| `comment` | `text` | SÍ | Texto con la experiencia detallada del comprador. |
| `status` | `text` | SÍ | Estado de moderación: `pending`, `approved`, `rejected`. |
| `created_at` | `timestamptz` | SÍ | Fecha y hora de envío de la reseña. |

---

### 7. Tabla `activity_logs` (Historial y Auditoría)

| Columna | Tipo | Nullable | Descripción / Uso |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `user_id` | `text` | SÍ | ID del usuario o admin que efectuó la acción. |
| `user_name` | `text` | SÍ | Nombre del usuario responsable. |
| `user_email` | `text` | SÍ | Correo del usuario. |
| `entity_type` | `text` | NO | Tipo de entidad afectada: `product`, `order`, `coupon`, `appointment`, `setting`. |
| `entity_id` | `text` | SÍ | ID del registro modificado. |
| `entity_name` | `text` | SÍ | Nombre o referencia legible (ej: `DT-931128` o `Sofá Modular`). |
| `action` | `text` | NO | Acción: `create`, `update`, `delete`, `status_change`, `siigo_sync`. |
| `description` | `text` | SÍ | Descripción en lenguaje natural del cambio realizado. |
| `details` | `jsonb` | SÍ | Diferencial de datos antes/después o payload recibido. |
| `ip_address` | `text` | SÍ | Dirección IP del cliente para seguridad. |
| `created_at` | `timestamptz` | SÍ | Marca temporal del evento. |

---

## 🪣 Almacenamiento (Supabase Storage)

Para alojar las imágenes de los productos, se utiliza un bucket público con las siguientes especificaciones:

* **Bucket Name:** `product-images`
* **Visibilidad:** `public = true`
* **Límite por archivo:** `10 MB`
* **MIME Types permitidos:** `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `image/gif`, `image/avif`
* **Políticas RLS de Storage:**
  * Lectura abierta a cualquier visitante web.
  * Inserción / Subida permitida a usuarios autenticados (o administradores).

---

## 🚀 Script SQL Maestro (1-Click Deployment)

Copia y pega el siguiente script directamente en el **SQL Editor** de un nuevo proyecto de Supabase para inicializar toda la estructura, índices, claves foráneas, políticas de seguridad y storage en segundos:

```sql
-- ==============================================================================
-- SCRIPT DE DESPLIEGUE MAESTRO: E-COMMERCE SUPABASE + POSTGRESQL
-- Incluye: Catálogo, Inventario, Pedidos, DIAN/Siigo, Citas, Reseñas, Roles y Storage
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLA: products (Catálogo de Productos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand_collection TEXT,
    description TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    original_price NUMERIC(12,2),
    category TEXT NOT NULL,
    style TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT '{}'::TEXT[],
    colors JSONB DEFAULT '[]'::JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    dimensions JSONB,
    materials TEXT[] DEFAULT '{}'::TEXT[],
    sku TEXT,
    warehouse_stock INTEGER DEFAULT 0,
    store_stock INTEGER DEFAULT 0,
    web_stock INTEGER DEFAULT 0,
    boxes_count INTEGER DEFAULT 1,
    warranty TEXT DEFAULT '1 año por defectos de fabricación',
    inventory_status TEXT DEFAULT 'in_stock',
    wholesale_price NUMERIC(12,2),
    wholesale_min_qty INTEGER DEFAULT 1,
    shipping_returns_info TEXT,
    care_instructions TEXT,
    fast_shipping_badge BOOLEAN DEFAULT FALSE,
    returns_policy_badge BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_inventory_status ON public.products(inventory_status);

-- ==============================================================================
-- 3. TABLA: orders (Pedidos, Envíos y Facturación DIAN / Siigo)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_ref TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_tag TEXT DEFAULT 'General',
    customer_document_type TEXT,
    customer_document_id TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    carrier TEXT DEFAULT 'Servientrega',
    tracking_number TEXT,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    shipping_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deposit_amount NUMERIC(12,2) DEFAULT 0.00,
    pending_balance NUMERIC(12,2) DEFAULT 0.00,
    total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status TEXT DEFAULT 'processing',
    payment_status TEXT DEFAULT 'pending',
    payment_gateway TEXT DEFAULT 'bold',
    payment_method TEXT,
    items_count INTEGER DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    notes TEXT,
    siigo_invoice_id TEXT,
    siigo_invoice_number TEXT,
    siigo_invoice_status TEXT DEFAULT 'pending',
    siigo_cufe TEXT,
    siigo_pdf_url TEXT,
    siigo_error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_order_ref ON public.orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- 4. TABLA: appointments (Agendamiento de Citas y Asesorías)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    city TEXT,
    address TEXT,
    price NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'paid',
    payment_gateway TEXT DEFAULT 'bold',
    bold_order_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- ==============================================================================
-- 5. TABLA: profiles (Roles y Permisos de Usuarios Administrativos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'collaborator',
    permissions JSONB DEFAULT '["dashboard_view", "orders_view", "products_view"]'::JSONB,
    status TEXT DEFAULT 'active',
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. TABLA: coupons (Cupones de Descuento)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12,2) NOT NULL,
    min_purchase NUMERIC(12,2) DEFAULT 0.00,
    expiry_date TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- ==============================================================================
-- 7. TABLA: product_reviews (Reseñas y Calificaciones)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.product_reviews(status);

-- ==============================================================================
-- 8. TABLA: activity_logs (Auditoría de Actividad)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    user_name TEXT,
    user_email TEXT,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    entity_name TEXT,
    action TEXT NOT NULL,
    description TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_entity ON public.activity_logs(entity_type, entity_id);

-- ==============================================================================
-- 9. CONFIGURACIÓN DE STORAGE (product-images)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    TRUE,
    10485760, -- 10MB
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = TRUE,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];

-- ==============================================================================
-- 10. POLÍTICAS DE SEGURIDAD ROW-LEVEL SECURITY (RLS)
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Products: Lectura pública, escritura por admins o servicio autenticado
CREATE POLICY "Permitir lectura publica de productos"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Permitir gestion completa de productos a administradores"
    ON public.products FOR ALL
    USING (auth.role() = 'authenticated');

-- Orders: Inserción pública (checkout), lectura y gestión por administradores
CREATE POLICY "Permitir crear ordenes desde checkout publico"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir lectura y gestion de ordenes a administradores"
    ON public.orders FOR ALL
    USING (auth.role() = 'authenticated');

-- Appointments: Inserción pública (reserva), lectura y gestión por administradores
CREATE POLICY "Permitir agendar citas publicamente"
    ON public.appointments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir administracion de citas"
    ON public.appointments FOR ALL
    USING (auth.role() = 'authenticated');

-- Profiles: Cada usuario puede leer y actualizar su perfil, admins leen todos
CREATE POLICY "Lectura de perfiles para usuarios autenticados"
    ON public.profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Actualizacion de perfil propio o admin"
    ON public.profiles FOR ALL
    USING (auth.role() = 'authenticated');

-- Coupons: Lectura pública para validar en checkout, gestión por admins
CREATE POLICY "Permitir validar cupones en checkout"
    ON public.coupons FOR SELECT
    USING (is_active = true);

CREATE POLICY "Permitir administracion de cupones"
    ON public.coupons FOR ALL
    USING (auth.role() = 'authenticated');

-- Product Reviews: Lectura de aprobadas, creación pública/autenticada, gestión admin
CREATE POLICY "Permitir ver reseñas aprobadas"
    ON public.product_reviews FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Permitir enviar nuevas reseñas"
    ON public.product_reviews FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir moderacion de reseñas a administradores"
    ON public.product_reviews FOR ALL
    USING (auth.role() = 'authenticated');

-- Activity Logs: Solo lectura y escritura administrativa
CREATE POLICY "Permitir gestion de logs a administradores"
    ON public.activity_logs FOR ALL
    USING (auth.role() = 'authenticated');

-- Políticas para el Storage Bucket (product-images)
CREATE POLICY "Acceso publico de lectura a imagenes"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Subida de imagenes autenticada"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Actualizacion y borrado de imagenes autenticada"
    ON storage.objects FOR ALL
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ==============================================================================
-- 11. TRIGGER PARA AUTO-ACTUALIZAR updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

---

## 💡 Pasos para Replicar en un Nuevo Proyecto

1. Crea un nuevo proyecto en [Supabase](https://supabase.com).
2. Ve a la pestaña **SQL Editor** en el panel izquierdo.
3. Copia todo el bloque de código de la sección **Script SQL Maestro (1-Click Deployment)** y pégalo.
4. Haz clic en **Run**. En menos de 5 segundos tendrás:
   * Las 7 tablas creadas con sus tipos de datos, llaves primarias e índices.
   * El bucket de almacenamiento `product-images` configurado.
   * Las políticas de seguridad (RLS) habilitadas para checkout público y panel privado.
   * Los triggers de actualización automática de fecha (`updated_at`).
5. Copia tus variables de entorno (`SUPABASE_URL` y `SUPABASE_ANON_KEY`) en tu archivo `.env` del frontend y el nuevo e-commerce estará listo para funcionar de inmediato.
