-- ==============================================================================
-- 🔒 FASE 2: SNAPSHOT Y BACKUP FORMAL DEL ESQUEMA DDL DE BASE DE DATOS SUPABASE
-- Fecha de Generación: 2026-09-30
-- Proyecto: Diseño Tu Espacio
-- Base de Datos: Supabase PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: profiles (Perfiles de Usuarios y Asesores)
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

-- 3. TABLA: products (Inventario Avanzado & Catálogo Oficial)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
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
  colors JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  dimensions TEXT,
  materials TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: orders (Registro de Pedidos & Kanban Multi-Gateway)
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

-- 5. TABLA: appointments (Agendamientos de Asesorías de Interiorismo)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  price DECIMAL(12, 2) NOT NULL DEFAULT 600000.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA: coupons (Cupones y Descuentos Comerciales)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12, 2) NOT NULL,
  min_purchase DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expiry_date DATE NOT NULL,
  usage_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA: shipping_rates (Tarifas de Envío por Ciudades de Colombia)
CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  department TEXT NOT NULL,
  cost DECIMAL(12, 2) NOT NULL,
  delivery_days TEXT NOT NULL,
  is_free_threshold BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. POLÍTICAS DE SEGURIDAD NIVEL DE FILA (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- Políticas en public.profiles
CREATE POLICY "Perfiles visibles para admins y colaboradores" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar perfiles" ON public.profiles FOR ALL USING (true);

-- Políticas en public.products
CREATE POLICY "Productos visibles para todos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir crear y modificar productos" ON public.products FOR ALL USING (true);

-- Políticas en public.orders
CREATE POLICY "Cualquiera puede crear orden" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir gestionar ordenes" ON public.orders FOR ALL USING (true);

-- Políticas en public.appointments
CREATE POLICY "Citas visibles para consulta" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Cualquiera puede agendar cita" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir gestionar citas" ON public.appointments FOR ALL USING (true);

-- Políticas en public.coupons & shipping_rates
CREATE POLICY "Cupones visibles para validación" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir gestionar cupones" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Tarifas de envío visibles para todos" ON public.shipping_rates FOR SELECT USING (true);

-- 9. TRIGGERS Y FUNCIONES AUTOMÁTICAS DE AUTENTICACIÓN
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role text;
  user_name text;
  user_perms jsonb;
BEGIN
  user_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  user_role := LOWER(COALESCE(new.raw_user_meta_data->>'role', 'customer'));

  IF user_role NOT IN ('admin', 'collaborator', 'customer') THEN
    user_role := 'customer';
  END IF;

  IF user_role = 'admin' THEN
    user_perms := '["manage_products", "manage_orders", "manage_appointments", "manage_coupons", "manage_team", "view_analytics", "edit_settings"]'::jsonb;
  ELSIF user_role = 'collaborator' THEN
    user_perms := '["manage_products", "manage_orders", "manage_appointments"]'::jsonb;
  ELSE
    user_perms := '[]'::jsonb;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, role, permissions, status)
  VALUES (
    new.id,
    user_name,
    new.email,
    user_role,
    user_perms,
    'active'
  )
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
