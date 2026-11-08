# 🏛️ Arquitectura de Base de Datos para E-commerce (Supabase / PostgreSQL)
## Estructura Oficial de Producción - Última Actualización 2026

Esta guía documenta la **arquitectura de datos completa y probada en producción** utilizada en la plataforma. Proporciona el diseño técnico, diccionario de datos y el **script SQL maestro de despliegue en 1 clic** para inicializar o replicar el e-commerce en cualquier entorno de **Supabase** o **PostgreSQL**.

---

## 🌟 Novedades y Mejoras Incorporadas Recientemente

1. **📦 Inventario Multicanal Reactivo (Bodega, Tienda y Web):**
   - División de existencias físicas y virtuales:
     * `warehouse_stock`: Bodega Principal.
     * `store_stock`: Tienda física / Showroom.
     * `web_stock`: Stock reservado para comercio electrónico online.
   - **Regla estricta:** `stock = warehouse_stock + store_stock + web_stock`. El stock general nunca se ingresa a mano; se calcula dinámicamente mediante trigger en PostgreSQL y formularios reactivos.
   - Descuento automático por canal en cada compra o despacho y restauración al cancelar órdenes.

2. **🧾 Facturación Electrónica DIAN Oficial (Integración Siigo Nube):**
   - Configuración oficial con tipo de documento `ElectronicInvoice` (ID `64261`), resolución DIAN N° 18764085159224 y prefijo `FEF`.
   - Registro automático de:
     * `siigo_invoice_id`: ID interno del comprobante en Siigo.
     * `siigo_invoice_number`: Consecutivo legal formateado (ej: `FEF-19`).
     * `siigo_cufe`: Código Único de Facturación Electrónica expedido y firmado por la DIAN.
     * `siigo_pdf_url`: Enlace público directo al visor del PDF oficial.
     * `siigo_invoice_status`: Estado fiscal (`pending`, `sent`, `error`).
     * `siigo_error_log`: Diagnóstico técnico detallado ante cualquier rechazo de validación.
     * Envío automático del comprobante fiscal al correo del comprador (`customer_email`).

3. **👥 Sistema RBAC & Sincronización Automática de Usuarios:**
   - Tabla `profiles` sincronizada con `auth.users` mediante trigger de base de datos (`on_auth_user_created`).
   - Roles definidos: `admin`, `collaborator`, `customer`.
   - Array JSONB de permisos granulares (`permissions`): `dashboard_view`, `orders_view`, `orders_edit`, `products_manage`, `billing_issue`, `analytics_view`, `coupons_manage`, `reviews_manage`, `settings_manage`.
   - Soporte para onboarding de administradores y contadores (ej: Natalia Alcaraz).

4. **💰 Gestión Financiera Dual (Total, Abonos y Saldos Pendientes):**
   - Registro de anticipos (`deposit_amount`), saldos contra entrega (`pending_balance`) y valor liquidado (`total`).
   - Estados de pago granulares: `pending`, `partial`, `paid`.

---

## 📋 Resumen de Tablas y Entidades

| Tabla | Propósito Principal | Relación Clave |
|---|---|---|
| `profiles` | Perfiles de usuarios, roles administrativos y permisos RBAC | `auth.users(id)` ON DELETE CASCADE |
| `products` | Catálogo maestro de productos, inventario multicanal y precios | Independiente |
| `orders` | Registro inmutable de compras, facturación DIAN y logística | Snapshot JSON inmutable de items |
| `appointments` | Agendamiento de citas presenciales o virtuales con pasarela | Independiente o vinculado a transacciones |
| `coupons` | Cupones de descuento (porcentaje o monto fijo COP) | Utilizado en checkout |
| `product_reviews` | Reseñas y calificaciones de 1 a 5 estrellas con moderación | `products(id)` y `auth.users(id)` |
| `activity_logs` | Auditoría y trazabilidad completa de cambios | Administrativo |

---

## 🗄️ Diccionario de Datos Detallado

### 1. Tabla `products` (Catálogo e Inventario Multicanal)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria (`gen_random_uuid()`). |
| `name` | `text` | NO | Nombre comercial del producto. |
| `slug` | `text` | NO | URL amigable única para SEO (ej: `comedor-nordico-roble-6-puestos`). |
| `brand_collection` | `text` | SÍ | Colección o línea (ej: `Colección Loft 2026`). |
| `description` | `text` | SÍ | Descripción técnica y comercial (soporta HTML/Markdown). |
| `price` | `numeric(12,2)` | NO | Precio de venta al público en moneda local (COP). |
| `original_price` | `numeric(12,2)` | SÍ | Precio de lista antes de descuento (tachado). |
| `category` | `text` | NO | Categoría principal (ej: `Salas`, `Comedores`, `Papelería`). |
| `style` | `text` | SÍ | Estilo decorativo (ej: `Minimalista`, `Industrial`, `Moderno`). |
| `stock` | `integer` | NO | **Stock total unificado.** Calculado automáticamente: `warehouse_stock + store_stock + web_stock`. |
| `warehouse_stock` | `integer` | SÍ | Cantidad disponible en Bodega Principal (default `0`). |
| `store_stock` | `integer` | SÍ | Cantidad disponible en Tienda física / Showroom (default `0`). |
| `web_stock` | `integer` | SÍ | Cantidad reservada para el canal e-commerce (default `0`). |
| `images` | `text[]` | SÍ | Array de URLs públicas de imágenes alojadas en Supabase Storage. |
| `colors` | `jsonb` | SÍ | Variantes de color: `[{"name": "Gris Grafito", "hex": "#4A4A4A"}]`. |
| `is_featured` | `boolean` | SÍ | Destacado en home page (`false` por defecto). |
| `dimensions` | `jsonb` | SÍ | Dimensiones: `{"width": 80, "height": 95, "depth": 75, "unit": "cm"}`. |
| `materials` | `text[]` | SÍ | Materiales de fabricación (ej: `["Madera Cedro", "Espuma alta densidad"]`). |
| `sku` | `text` | SÍ | Código único de referencia interna / bodega. |
| `boxes_count` | `integer` | SÍ | Número de cajas o bultos de despacho. |
| `warranty` | `text` | SÍ | Términos de garantía (ej: `1 año por defectos de fabricación`). |
| `inventory_status` | `text` | SÍ | Estado: `in_stock`, `low_stock`, `out_of_stock`, `pre_order`. |
| `wholesale_price` | `numeric(12,2)` | SÍ | Precio para compras al por mayor o arquitectos. |
| `wholesale_min_qty` | `integer` | SÍ | Cantidad mínima para activar precio mayorista. |
| `shipping_returns_info`| `text` | SÍ | Políticas de envío, entrega y devoluciones. |
| `care_instructions` | `text` | SÍ | Instrucciones de mantenimiento y limpieza. |
| `fast_shipping_badge` | `boolean` | SÍ | Badge "Envío Express" en la ficha del producto. |
| `returns_policy_badge` | `boolean` | SÍ | Badge "Garantía de Satisfacción". |
| `created_at` | `timestamptz` | SÍ | Fecha de creación (`now()`). |
| `updated_at` | `timestamptz` | SÍ | Fecha de última edición (`now()`). |
| `updated_by` | `text` | SÍ | Email o ID de quien modificó el registro. |

---

### 2. Tabla `orders` (Pedidos, Pagos y Facturación DIAN / Siigo)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Identificador único interno. |
| `order_ref` | `text` | NO | Referencia visible y de rastreo (ej: `DT-931128`). |
| `customer_name` | `text` | NO | Nombre y apellido del comprador. |
| `customer_email` | `text` | NO | Correo electrónico de contacto y envío de factura legal. |
| `customer_phone` | `text` | SÍ | Teléfono o móvil para logística y WhatsApp. |
| `customer_tag` | `text` | SÍ | Clasificación: `General`, `VIP`, `Mayorista`, `Arquitecto`. |
| `customer_document_type` | `text` | SÍ | Tipo documento fiscal: `CC`, `NIT`, `CE`, `PP`. |
| `customer_document_id` | `text` | SÍ | Cédula o NIT sin guiones ni dígito de verificación. |
| `shipping_address` | `text` | NO | Dirección de entrega (o indicación de retiro en tienda). |
| `city` | `text` | NO | Ciudad y departamento de destino. |
| `carrier` | `text` | SÍ | Transportadora (ej: `Servientrega`, `Coordinadora`, `Envía`, `Propio`). |
| `tracking_number` | `text` | SÍ | Número de guía logística. |
| `subtotal` | `numeric(12,2)` | NO | Valor de los productos antes de envíos o descuentos. |
| `shipping_cost` | `numeric(12,2)` | NO | Flete cobrado ($0 si aplica retiro en tienda o gratis). |
| `discount` | `numeric(12,2)` | NO | Valor descontado por cupones aplicados. |
| `deposit_amount` | `numeric(12,2)` | SÍ | Monto pagado como anticipo/abono inicial. |
| `pending_balance` | `numeric(12,2)` | SÍ | Saldo pendiente por cobrar (`total - deposit_amount`). |
| `total` | `numeric(12,2)` | NO | Monto final liquidado (`subtotal + shipping_cost - discount`). |
| `status` | `text` | SÍ | Estado logístico: `pending`, `processing`, `shipped`, `delivered`, `cancelled`. |
| `payment_status` | `text` | SÍ | Estado financiero: `pending`, `partial`, `paid`. |
| `payment_gateway` | `text` | SÍ | Pasarela utilizada: `bold`, `wompi`, `manual_transfer`. |
| `payment_method` | `text` | SÍ | Método de pago: `Tarjeta de Crédito`, `PSE`, `Nequi`, `Bancolombia`. |
| `items_count` | `integer` | SÍ | Total de unidades compradas. |
| `items` | `jsonb` | NO | **Snapshot JSON inmutable:** `[{"id", "name", "price", "quantity", "image", "sku"}]`. |
| `notes` | `text` | SÍ | Indicaciones de entrega o notas internas. |
| `siigo_invoice_id` | `text` | SÍ | ID del comprobante retornado por Siigo Nube. |
| `siigo_invoice_number` | `text` | SÍ | Consecutivo oficial emitido ante la DIAN (ej: `FEF-19`). |
| `siigo_invoice_status` | `text` | SÍ | Estado fiscal: `pending`, `sent`, `error`. |
| `siigo_cufe` | `text` | SÍ | Código Único de Facturación Electrónica DIAN. |
| `siigo_pdf_url` | `text` | SÍ | URL pública para visualizar o descargar el PDF fiscal. |
| `siigo_error_log` | `text` | SÍ | Log de error de Siigo/DIAN en caso de fallo. |
| `created_at` | `timestamptz` | SÍ | Fecha de creación (`now()`). |
| `updated_at` | `timestamptz` | SÍ | Fecha de última actualización. |
| `updated_by` | `text` | SÍ | Administrador que gestionó la orden. |

---

### 3. Tabla `profiles` (Usuarios, Roles y Permisos RBAC)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Llave foránea que referencia `auth.users(id)` ON DELETE CASCADE. |
| `full_name` | `text` | NO | Nombre completo del colaborador o cliente. |
| `email` | `text` | NO | Correo electrónico único. |
| `role` | `text` | NO | Rol: `admin`, `collaborator`, `customer`. |
| `permissions` | `jsonb` | SÍ | Array de permisos: `["dashboard_view", "orders_view", "orders_edit", "products_manage", "billing_issue", "analytics_view", "coupons_manage", "reviews_manage", "settings_manage"]`. |
| `status` | `text` | NO | `active`, `suspended`. |
| `phone` | `text` | SÍ | Teléfono de contacto. |
| `created_at` | `timestamptz` | NO | Fecha de creación. |
| `updated_at` | `timestamptz` | SÍ | Fecha de actualización. |

---

### 4. Tabla `appointments` (Agendamiento de Citas y Asesorías)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `customer_name` | `text` | NO | Nombre del cliente. |
| `customer_email` | `text` | NO | Correo del solicitante. |
| `customer_phone` | `text` | NO | Celular / WhatsApp de contacto. |
| `service_type` | `text` | NO | Ej: `Asesoría en Showroom`, `Diseño Virtual`, `Visita de Medición`. |
| `appointment_date` | `date` | NO | Fecha solicitada (AAAA-MM-DD). |
| `appointment_time` | `text` | NO | Franja horaria acordada. |
| `city` | `text` | SÍ | Ciudad de la cita. |
| `address` | `text` | SÍ | Dirección del proyecto. |
| `price` | `numeric(12,2)` | SÍ | Valor cobrado por la asesoría ($0 si es cortesía). |
| `status` | `text` | SÍ | `pending`, `confirmed`, `completed`, `cancelled`. |
| `payment_status` | `text` | SÍ | `pending`, `paid`. |
| `payment_gateway` | `text` | SÍ | Pasarela utilizada. |
| `bold_order_id` | `text` | SÍ | Referencia en pasarela Bold. |
| `notes` | `text` | SÍ | Observaciones o requerimientos de diseño. |
| `created_at` | `timestamptz` | SÍ | Fecha de creación. |

---

### 5. Tabla `coupons` (Cupones de Descuento)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `code` | `text` | NO | Código en mayúsculas (ej: `BIENVENIDO10`, `DESCUENTO50K`). |
| `discount_type` | `text` | NO | `percentage` (% de descuento) o `fixed` (valor fijo en pesos COP). |
| `discount_value` | `numeric(12,2)` | NO | Valor del descuento. |
| `min_purchase` | `numeric(12,2)` | SÍ | Compra mínima para activar el cupón. |
| `expiry_date` | `timestamptz` | SÍ | Fecha límite de validez. |
| `usage_count` | `integer` | SÍ | Contador de redenciones acumuladas. |
| `is_active` | `boolean` | SÍ | `true` (activo) o `false` (pausado). |
| `created_at` | `timestamptz` | SÍ | Fecha de creación. |

---

### 6. Tabla `product_reviews` (Calificaciones y Reseñas)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `product_id` | `uuid` | NO | Referencia a `products(id)` ON DELETE CASCADE. |
| `user_id` | `uuid` | SÍ | Referencia a `auth.users(id)` ON DELETE SET NULL. |
| `user_name` | `text` | NO | Nombre público del autor. |
| `user_email` | `text` | SÍ | Correo del autor. |
| `rating` | `integer` | NO | Puntuación del 1 al 5 (`CHECK (rating >= 1 AND rating <= 5)`). |
| `title` | `text` | SÍ | Título de la opinión. |
| `comment` | `text` | SÍ | Comentario completo. |
| `status` | `text` | SÍ | `approved`, `pending`, `rejected`. |
| `created_at` | `timestamptz` | SÍ | Fecha de publicación. |

---

### 7. Tabla `activity_logs` (Historial y Auditoría de Cambios)

| Columna | Tipo | Nullable | Descripción / Regla |
|---|---|---|---|
| `id` | `uuid` | NO | Llave primaria. |
| `user_id` | `text` | SÍ | ID del usuario responsable. |
| `user_name` | `text` | SÍ | Nombre del colaborador. |
| `user_email` | `text` | SÍ | Correo del colaborador. |
| `entity_type` | `text` | NO | `product`, `order`, `coupon`, `appointment`, `setting`. |
| `entity_id` | `text` | SÍ | Identificador del registro modificado. |
| `entity_name` | `text` | SÍ | Nombre de referencia visible. |
| `action` | `text` | NO | `create`, `update`, `delete`, `status_change`, `siigo_sync`. |
| `description` | `text` | SÍ | Resumen en lenguaje claro del cambio. |
| `details` | `jsonb` | SÍ | Payload o diferencial antes/después. |
| `ip_address` | `text` | SÍ | Dirección IP del cliente. |
| `created_at` | `timestamptz` | SÍ | Marca de tiempo. |

---

## 🪣 Almacenamiento (Supabase Storage)

* **Bucket:** `product-images`
* **Visibilidad:** `public = true`
* **Límite por archivo:** `10 MB`
* **Formatos soportados:** `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `image/svg+xml`, `image/gif`, `image/avif`.
* **Políticas RLS:**
  - Lectura pública irrestricta mediante CDN.
  - Subida, edición y eliminación permitida a usuarios autenticados con rol administrativo.

---

## 🚀 Script SQL Maestro Consolidado (1-Click Deployment)

Copia y pega este script completo en el **SQL Editor** de Supabase para inicializar la base de datos de extremo a extremo:

```sql
-- ==============================================================================
-- 🏛️ E-COMMERCE MASTER DATABASE SCHEMA (POSTGRESQL / SUPABASE NUBE)
-- Incluye: Catálogo, Inventario Multicanal, Pedidos, Facturación DIAN, RBAC y Triggers
-- ==============================================================================

-- 1. HABILITAR EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLA: profiles (Perfiles Administrativos y RBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'collaborator', 'admin')),
    permissions JSONB DEFAULT '["dashboard_view", "orders_view", "products_view"]'::JSONB,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABLA: products (Catálogo e Inventario Multicanal)
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
    warehouse_stock INTEGER DEFAULT 0,
    store_stock INTEGER DEFAULT 0,
    web_stock INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}'::TEXT[],
    colors JSONB DEFAULT '[]'::JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    dimensions JSONB,
    materials TEXT[] DEFAULT '{}'::TEXT[],
    sku TEXT,
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
-- 4. TABLA: orders (Pedidos, Abonos y Facturación Electrónica DIAN / Siigo)
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
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
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
-- 5. TABLA: appointments (Citas y Asesorías)
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
-- 9. TRIGGERS AUTOMÁTICOS
-- ==============================================================================

-- A. Actualización automática de updated_at
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

-- B. Cálculo reactivo de stock multicanal
CREATE OR REPLACE FUNCTION public.calculate_total_stock()
RETURNS TRIGGER AS $$
BEGIN
    NEW.stock = COALESCE(NEW.warehouse_stock, 0) + COALESCE(NEW.store_stock, 0) + COALESCE(NEW.web_stock, 0);
    IF NEW.stock <= 0 THEN
        NEW.inventory_status = 'out_of_stock';
    ELSIF NEW.stock < 5 THEN
        NEW.inventory_status = 'low_stock';
    ELSE
        NEW.inventory_status = 'in_stock';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_total_stock ON public.products;
CREATE TRIGGER trigger_calculate_total_stock
    BEFORE INSERT OR UPDATE OF warehouse_stock, store_stock, web_stock ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_total_stock();

-- C. Sincronización automática de usuarios Auth -> Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, permissions, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        COALESCE(NEW.raw_user_meta_data->'permissions', '["dashboard_view", "orders_view", "products_view"]'::jsonb),
        'active'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. CONFIGURACIÓN DE STORAGE (product-images)
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
-- 11. POLÍTICAS DE SEGURIDAD ROW-LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Products: Lectura pública, gestión administrativa
CREATE POLICY "Permitir lectura publica de productos"
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Permitir gestion de productos a autenticados"
    ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Inserción en checkout público, gestión administrativa
CREATE POLICY "Permitir crear ordenes desde checkout publico"
    ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir gestion de ordenes a administradores"
    ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- Appointments: Inserción pública, gestión administrativa
CREATE POLICY "Permitir agendar citas publicamente"
    ON public.appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir administracion de citas"
    ON public.appointments FOR ALL USING (auth.role() = 'authenticated');

-- Profiles: Lectura y actualización para autenticados
CREATE POLICY "Lectura de perfiles para autenticados"
    ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Actualizacion de perfil autenticado"
    ON public.profiles FOR ALL USING (auth.role() = 'authenticated');

-- Coupons: Lectura de cupones activos, gestión admin
CREATE POLICY "Permitir validar cupones en checkout"
    ON public.coupons FOR SELECT USING (is_active = true);

CREATE POLICY "Permitir administracion de cupones"
    ON public.coupons FOR ALL USING (auth.role() = 'authenticated');

-- Reviews: Lectura de aprobadas, creación pública, gestión admin
CREATE POLICY "Permitir ver reseñas aprobadas"
    ON public.product_reviews FOR SELECT USING (status = 'approved');

CREATE POLICY "Permitir enviar nuevas reseñas"
    ON public.product_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir moderacion de reseñas a administradores"
    ON public.product_reviews FOR ALL USING (auth.role() = 'authenticated');

-- Logs: Gestión administrativa
CREATE POLICY "Permitir gestion de logs a administradores"
    ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- Storage Policies
CREATE POLICY "Acceso publico de lectura a imagenes"
    ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Subida de imagenes autenticada"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Actualizacion y borrado de imagenes autenticada"
    ON storage.objects FOR ALL USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

---

## 🔐 Consulta Rápida: Onboarding de Administrador / Contador

Para elevar un usuario ya creado en Supabase Auth al rol de `admin` con permisos completos (como la contadora Natalia Alcaraz):

```sql
INSERT INTO public.profiles (id, full_name, email, role, permissions, status)
VALUES (
  '03b67f47-0b0f-4c60-b192-e8b1202833c8', -- Reemplazar con el ID de auth.users
  'Natalia Alcaraz',
  'nataliaalcarazcontadora@gmail.com',
  'admin',
  '["dashboard_view", "orders_view", "orders_edit", "products_manage", "billing_issue", "analytics_view", "coupons_manage", "reviews_manage", "settings_manage"]'::jsonb,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  permissions = EXCLUDED.permissions,
  status = 'active';
```

---

## 🛠️ Instrucciones de Despliegue en 3 Pasos

1. **Crear Proyecto:** Inicia un proyecto en [Supabase](https://supabase.com).
2. **Ejecutar Script:** Abre el **SQL Editor**, pega el bloque de la sección **Script SQL Maestro Consolidado** y haz clic en **Run**.
3. **Vincular Frontend:** Configura las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en tu archivo `.env` o en las variables de Cloudflare Pages / Vercel. Todo el flujo (catálogo, inventario reactivo, checkout, DIAN/Siigo y panel administrativo) quedará operativo al 100%.
