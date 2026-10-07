-- ==============================================================================
-- ⚡ DISEÑO TU ESPACIO - CONFIGURACIÓN COMPLETA PARA EL NUEVO PROYECTO SUPABASE
-- Ejecutar este archivo completo en el SQL Editor del nuevo proyecto
-- ==============================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Productos (Con todas las columnas de inventario y post-venta)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_collection TEXT DEFAULT 'Diseño Tu Espacio Collection',
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  original_price DECIMAL(12, 2),
  category TEXT NOT NULL DEFAULT '',
  style TEXT NOT NULL DEFAULT '',
  stock INT NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  dimensions TEXT DEFAULT '',
  materials TEXT DEFAULT '',
  sku TEXT DEFAULT '',
  warehouse_stock INT DEFAULT 0,
  store_stock INT DEFAULT 0,
  web_stock INT DEFAULT 0,
  boxes_count INT DEFAULT 0,
  warranty TEXT DEFAULT '3 años',
  inventory_status TEXT DEFAULT 'Disponible',
  wholesale_price DECIMAL(12, 2),
  wholesale_min_qty INT DEFAULT 5,
  shipping_returns_info TEXT DEFAULT '',
  care_instructions TEXT DEFAULT '',
  fast_shipping_badge TEXT DEFAULT '',
  returns_policy_badge TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by TEXT DEFAULT ''
);

-- 3. Tabla de Pedidos u Órdenes (Con abonos, saldo y estados de pago)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_tag TEXT DEFAULT 'Residencial',
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  carrier TEXT DEFAULT 'Servientrega',
  tracking_number TEXT DEFAULT '',
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  deposit_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  pending_balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_gateway TEXT NOT NULL DEFAULT 'Wompi Colombia',
  payment_method TEXT NOT NULL DEFAULT 'Tarjeta de Crédito',
  items_count INT DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by TEXT DEFAULT ''
);

-- 4. Tabla de Citas y Visitas
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'paid',
  price DECIMAL(12, 2) NOT NULL DEFAULT 600000.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Cupones de Descuento
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value DECIMAL(12, 2) NOT NULL,
  min_purchase DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expiry_date DATE NOT NULL,
  usage_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Perfiles y Miembros de Equipo
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  permissions JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Historial y Bitácora de Actividades
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 🔒 HABILITAR RLS Y POLÍTICAS DE ACCESO
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select on products" ON public.products;
CREATE POLICY "Public select on products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert on products" ON public.products;
CREATE POLICY "Public insert on products" ON public.products FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update on products" ON public.products;
CREATE POLICY "Public update on products" ON public.products FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete on products" ON public.products;
CREATE POLICY "Public delete on products" ON public.products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public select on orders" ON public.orders;
CREATE POLICY "Public select on orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert on orders" ON public.orders;
CREATE POLICY "Public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update on orders" ON public.orders;
CREATE POLICY "Public update on orders" ON public.orders FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete on orders" ON public.orders;
CREATE POLICY "Public delete on orders" ON public.orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public access on appointments" ON public.appointments;
CREATE POLICY "Public access on appointments" ON public.appointments FOR ALL USING (true);
DROP POLICY IF EXISTS "Public access on coupons" ON public.coupons;
CREATE POLICY "Public access on coupons" ON public.coupons FOR ALL USING (true);
DROP POLICY IF EXISTS "Public access on profiles" ON public.profiles;
CREATE POLICY "Public access on profiles" ON public.profiles FOR ALL USING (true);
DROP POLICY IF EXISTS "Public access on activity_logs" ON public.activity_logs;
CREATE POLICY "Public access on activity_logs" ON public.activity_logs FOR ALL USING (true);

-- ==============================================================================
-- 📦 BUCKET DE ALMACENAMIENTO PRODUCT-IMAGES Y SUS POLÍTICAS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Access on product-images" ON storage.objects;
CREATE POLICY "Public Read Access on product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Insert Access on product-images" ON storage.objects;
CREATE POLICY "Public Insert Access on product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Update Access on product-images" ON storage.objects;
CREATE POLICY "Public Update Access on product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Delete Access on product-images" ON storage.objects;
CREATE POLICY "Public Delete Access on storage" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
