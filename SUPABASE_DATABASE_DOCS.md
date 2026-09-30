# 📚 Documentación Técnica de Base de Datos y Supabase - "Diseño tu Espacio"

Esta documentación detalla la arquitectura de base de datos, el esquema SQL completo, las estrategias de sincronización en tiempo real y las optimizaciones para la plataforma e-commerce y panel administrativo de **Diseño tu Espacio**.

---

## 🏗️ 1. Visión General de la Arquitectura (Hybrid Resilience Architecture)

El sistema utiliza un patrón de **Arquitectura Híbrida Resiliente**:

- **Fuente de Verdad (Source of Truth)**: Base de datos **Supabase PostgreSQL** alojada en la nube.
- **Resguardo Local y Modo Offline (Fallback Cache)**: `localStorage` del navegador (`luxe_products_v16`, `luxe_orders_cache_v2`). Permite a los asesores continuar trabajando, registrando pedidos y modificando inventarios incluso en situaciones de inestabilidad de red.
- **Sincronización en Tiempo Real**: WebSockets mediante canal de Supabase Realtime (`postgres_changes`), notificando a todos los navegadores abiertos cuando un asesor registra o modifica un pedido o inventario.
- **Optimización para el Plan Gratuito de Supabase**:
  - Lecturas optimizadas con caché en memoria local para reducir la transferencia de datos (Egress).
  - Consultas batch inteligentes que agrupan inserciones y actualizaciones (`upsert`/`update`).

---

## 🗄️ 2. Esquema de Tablas (Data Models)

### 📦 2.1. Tabla: `products` (Inventario & Catálogo Oficial)
Almacena el catálogo completo de productos con desgloses de existencias por ubicación, garantías y precios diferenciados (Normal vs Mayorista).

| Columna | Tipo SQL | Descripción / Reglas |
| :--- | :--- | :--- |
| `id` | `UUID` / `TEXT` | Identificador único (Primary Key). |
| `name` | `TEXT` | Nombre oficial del producto. |
| `slug` | `TEXT` | Slug para URL amigable (Único). |
| `sku` | `TEXT` | Código de referencia interno (SKU). |
| `brand_collection` | `TEXT` | Colección o marca (Ej. *Diseño Tu Espacio Collection*). |
| `category` | `TEXT` | Categoría (*Cuadros*, *Espejos*, *Papel de Colgadura*, *Lavamanos*, etc.). |
| `style` | `TEXT` | Estilo de diseño (*Minimalista*, *Contemporáneo*, *Bauhaus*, etc.). |
| `price` | `DECIMAL(12,2)` | Precio de venta al público en Pesos Colombianos (COP). |
| `original_price` | `DECIMAL(12,2)` | Precio de lista u oferta previa (Nullable). |
| `wholesale_price` | `DECIMAL(12,2)` | **Precio Mayorista** para compras al por mayor (Nullable). |
| `wholesale_min_qty` | `INT` | Cantidad mínima de unidades/cajas para precio mayorista. |
| `stock` | `INT` | Existencias totales disponibles. |
| `warehouse_stock` | `INT` | Existencias en **Bodega Principal**. |
| `store_stock` | `INT` | Existencias en **Tienda Física / Showroom**. |
| `web_stock` | `INT` | Existencias destinadas a la **Tienda Web**. |
| `boxes_count` | `INT` | Cantidad de cajas asociadas al empaque. |
| `warranty` | `TEXT` | Tiempo de garantía (Ej. *3 años*, *50 años*). |
| `inventory_status` | `TEXT` | Estado (*Disponible*, *Agotado*, *Preventa*, *Bajo Pedido*, *Privado*). |
| `images` | `TEXT[]` / `JSONB` | Array con URLs o cadenas Base64 de las fotografías. |
| `colors` | `JSONB` | Array de acabados/colores: `[{"name": "Latón", "hex": "#CDB375"}]`. |
| `dimensions` | `TEXT` | Dimensiones físicas (Ej. *100x140 cm*). |
| `materials` | `TEXT` | Materiales de fabricación (Ej. *Lienzo, Marco Aluminio*). |
| `description` | `TEXT` | Descripción comercial detallada. |
| `is_featured` | `BOOLEAN` | Si destaca en el banner principal del sitio web. |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación del registro. |
| `updated_at` | `TIMESTAMPTZ` | Última fecha de modificación. |
| `updated_by` | `TEXT` | Nombre y correo del asesor/admin que realizó la última edición. |

---

### 🛒 2.2. Tabla: `orders` (Registro de Pedidos & Kanban)
Registra cada compra o venta realizada por los asesores o clientes.

| Columna | Tipo SQL | Descripción / Reglas |
| :--- | :--- | :--- |
| `id` | `UUID` / `TEXT` | Identificador único del pedido. |
| `order_ref` | `TEXT` | Referencia visible del pedido (Ej. `DT-918234`). |
| `user_id` | `UUID` | ID del usuario/asesor (FK opcional a `profiles`). |
| `customer_name` | `TEXT` | Nombre del cliente. |
| `customer_email` | `TEXT` | Correo electrónico del cliente. |
| `customer_phone` | `TEXT` | Teléfono de contacto / WhatsApp. |
| `customer_tag` | `TEXT` | Clasificación (*VIP*, *Arquitecto*, *Residencial*, *Mayorista*). |
| `shipping_address` | `TEXT` | Dirección completa de entrega. |
| `city` | `TEXT` | Ciudad de despacho (Ej. *Bogotá D.C.*, *Medellín*). |
| `carrier` | `TEXT` | Empresa de transporte (*Servientrega*, *Interrapidísimo*, etc.). |
| `tracking_number` | `TEXT` | Guía de rastreo del despacho. |
| `subtotal` | `DECIMAL(12,2)` | Subtotal de los productos sin costo de envío. |
| `shipping_cost` | `DECIMAL(12,2)` | Costo del despacho. |
| `discount` | `DECIMAL(12,2)` | Descuentos aplicados. |
| `total` / `total_amount` | `DECIMAL(12,2)` | Valor total cobrado al cliente. |
| `status` | `TEXT` | Estado Kanban (`pending`, `processing`, `shipped`, `delivered`, `cancelled`). |
| `payment_method` | `TEXT` | Método (*Tarjeta de Crédito*, *PSE*, *Mercado Pago*, *Efectivo*). |
| `payment_gateway` | `TEXT` | Pasarela utilizada. |
| `items_count` | `INT` | Total de ítems o productos en la orden. |
| `items` | `JSONB` | Array con detalle del ítem, unidades, precio aplicado (`price_type: "wholesale" \| "normal"`) y color. |
| `notes` | `TEXT` | Observaciones internas o requisitos del cliente. |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación del pedido. |
| `updated_at` | `TIMESTAMPTZ` | Fecha de actualización de estado. |
| `updated_by` | `TEXT` | Nombre del usuario que actualizó el pedido. |

---

### 👥 2.3. Tabla: `profiles` (Usuarios, Asesores y Permisos)
Maneja el control de acceso basado en roles (RBAC).

| Columna | Tipo SQL | Descripción / Reglas |
| :--- | :--- | :--- |
| `id` | `UUID` | ID vinculado a `auth.users` en Supabase Auth. |
| `full_name` | `TEXT` | Nombre completo del usuario o asesor. |
| `email` | `TEXT` | Correo electrónico único. |
| `role` | `TEXT` | Rol asignado (`admin`, `collaborator`, `customer`). |
| `permissions` | `JSONB` | Array de permisos (`manage_products`, `manage_orders`, `view_analytics`, etc.). |
| `status` | `TEXT` | Estado de la cuenta (`active`, `suspended`). |
| `created_at` | `TIMESTAMPTZ` | Fecha de registro. |

---

### 🗓️ 2.4. Tabla: `appointments` (Citas de Interiorismo)
Agendamientos de visitas a showroom y asesorías de diseño.

| Columna | Tipo SQL | Descripción / Reglas |
| :--- | :--- | :--- |
| `id` | `UUID` | ID único de la cita. |
| `customer_name` | `TEXT` | Nombre del cliente. |
| `customer_email` | `TEXT` | Correo electrónico. |
| `customer_phone` | `TEXT` | Teléfono. |
| `service_type` | `TEXT` | Tipo de asesoría (*Asesoría de Interiorismo*, *Cotización a Medida*). |
| `appointment_date` | `DATE` | Fecha agendada. |
| `appointment_time` | `TIME` | Hora agendada. |
| `status` | `TEXT` | Estado (`pending`, `confirmed`, `completed`, `cancelled`). |

---

### 🎟️ 2.5. Tabla: `coupons` (Cupones y Descuentos)
Cupones de descuento comercial.

| Columna | Tipo SQL | Descripción / Reglas |
| :--- | :--- | :--- |
| `id` | `UUID` | ID único. |
| `code` | `TEXT` | Código del cupón (Único, ej. `BIENVENIDA10`). |
| `discount_type` | `TEXT` | Porcentaje (`percentage`) o valor fijo (`fixed`). |
| `discount_value` | `DECIMAL(12,2)` | Monto del descuento. |
| `is_active` | `BOOLEAN` | Estado de vigencia. |

---

## ⚡ 3. Reglas de Negocio & Lógica de Sincronización

### 3.1. Coincidencia Flexible de Categorías (`isCategoryMatch`)
Para evitar que productos o imágenes se oculten si un usuario modifica el nombre de una categoría (por ejemplo, renombrar `"Cuadros & Espejos"` a `"Cuadros"`), el sistema utiliza una regla de normalización lógica:
- `Cuadros`, `Cuadros & Espejos`, `Cuadros y Espejos` se reconocen lógicamente como la **misma categoría**.
- Esto garantiza que ningún producto ni foto quede huérfano ni oculto en la interfaz.

### 3.2. Deducción Automática de Inventario por Ubicación
Al registrar un pedido en la sección de ventas:
1. El sistema descuenta las unidades correspondientes del campo `stock` global y del campo `web_stock`.
2. Se revalida automáticamente el `inventory_status`: si el stock llega a `0`, cambia a `'Agotado'`; si es mayor a `0`, se mantiene en `'Disponible'`.
3. El cambio se propaga inmediatamente a Supabase Nube.

### 3.3. Herramienta 1-Click "Sincronizar Nube" & Respaldo JSON
En el panel administrativo se cuentan con dos utilidades clave de infraestructura:
- **`Sincronizar Nube`**: Ejecuta `productService.syncAllToSupabase()` y `orderService.syncAllToSupabase()`, tomando cualquier cambio o foto guardada localmente y asegurando que quede almacenada en la base de datos Supabase Nube.
- **`Copia JSON` & `Restaurar JSON`**: Genera o carga un archivo `.json` liviano con la copia exacta de productos, pedidos y fotos. Ideal para migración rápida de dispositivos o copias de seguridad de respaldo.

---

## 📜 4. Script SQL DDL Completo (Ejecución Directa en Supabase SQL Editor)

A continuación se encuentra el script completo listo para ejecutar en el **SQL Editor** de Supabase:

```sql
-- ==============================================================================
-- 🏗️ DISEÑO TU ESPACIO - SCRIPT DDL COMPLETO DE ESTRUCTURA Y SEGURIDAD RLS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Perfiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'collaborator', 'admin')),
  permissions JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Productos (Con Inventario Avanzado y Precios Mayoristas)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_collection TEXT DEFAULT 'Diseño Tu Espacio Collection',
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  original_price DECIMAL(12, 2),
  wholesale_price DECIMAL(12, 2),
  wholesale_min_qty INT DEFAULT 5,
  category TEXT NOT NULL,
  style TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  warehouse_stock INT DEFAULT 0,
  store_stock INT DEFAULT 0,
  web_stock INT DEFAULT 0,
  boxes_count INT DEFAULT 1,
  warranty TEXT DEFAULT '3 años',
  inventory_status TEXT DEFAULT 'Disponible',
  images TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  dimensions TEXT,
  materials TEXT,
  sku TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Pedidos y Órdenes
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_tag TEXT DEFAULT 'Residencial',
  shipping_address TEXT,
  city TEXT DEFAULT 'Bogotá D.C.',
  carrier TEXT DEFAULT 'Servientrega',
  tracking_number TEXT,
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'Tarjeta de Crédito',
  payment_gateway TEXT NOT NULL DEFAULT 'Wompi Colombia',
  items_count INT DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Habilitar Seguridad Nivel de Fila (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acceso Público / Asesores
CREATE POLICY "Permitir lectura publica de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir escritura total en productos" ON public.products FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de ordenes" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Permitir escritura total en ordenes" ON public.orders FOR ALL USING (true);

CREATE POLICY "Permitir lectura de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir gestion de perfiles" ON public.profiles FOR ALL USING (true);
```
