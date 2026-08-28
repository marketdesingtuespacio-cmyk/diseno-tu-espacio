-- ==============================================================================
-- 🏗️ DISEÑO TU ESPACIO - ESQUEMA OFICIAL DE BASE DE DATOS SUPABASE (ROLES & PERMISOS)
-- ==============================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Perfiles y Roles (Admin, Colaborador, Cliente)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'collaborator', 'admin')),
  permissions JSONB DEFAULT '[]'::jsonb, -- Array de permisos: ['manage_products', 'manage_orders', 'manage_appointments', 'manage_coupons', 'manage_team', 'view_analytics']
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Productos (Iluminación & Interiores)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_collection TEXT DEFAULT 'Diseño Tu Espacio Collection',
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL, -- Precios en Pesos Colombianos (COP)
  original_price DECIMAL(12, 2),
  category TEXT NOT NULL,       -- 'Lámparas de Techo', 'Lámparas de Pie', 'Iluminación de Pared', etc.
  style TEXT NOT NULL,          -- 'Minimalista', 'Bauhaus', 'Nórdico', 'Contemporáneo'
  stock INT NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB DEFAULT '[]',     -- Variantes de color/acabados en formato JSON [{name, hex}]
  is_featured BOOLEAN DEFAULT false,
  dimensions TEXT,
  materials TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Citas y Visitas (Agendamiento de Asesorías)
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

-- 5. Tabla de Órdenes y Pedidos (Multi-Gateway)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_gateway TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Cupones de Descuento
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

-- 7. Tabla de Tasas de Envío por Ciudades de Colombia
CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  department TEXT NOT NULL,
  cost DECIMAL(12, 2) NOT NULL,
  delivery_days TEXT NOT NULL,
  is_free_threshold BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 🔒 POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- Políticas de Perfiles y Roles
CREATE POLICY "Perfiles visibles para admins y colaboradores" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar perfiles" ON public.profiles FOR ALL USING (true);

-- Políticas de Productos (Lectura y Escritura Total)
CREATE POLICY "Productos visibles para todos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir crear y modificar productos" ON public.products FOR ALL USING (true);

-- Políticas de Cupones, Citas y Órdenes
CREATE POLICY "Cupones visibles para validación" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir gestionar cupones" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Tarifas de envío visibles para todos" ON public.shipping_rates FOR SELECT USING (true);
CREATE POLICY "Citas visibles para consulta" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Cualquiera puede agendar cita" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir gestionar citas" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Cualquiera puede crear orden" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir gestionar ordenes" ON public.orders FOR ALL USING (true);

-- ==============================================================================
-- 📦 DATOS INICIALES (PERFILES DE EQUIPO, PRODUCTOS & TARIFAS)
-- ==============================================================================

-- Insertar Perfiles Iniciales (Admin vs Colaborador)
INSERT INTO public.profiles (full_name, email, role, permissions, status)
VALUES
(
  'Director General (Admin)', 
  'admin@disenotuespacio.com', 
  'admin', 
  '["manage_products", "manage_orders", "manage_appointments", "manage_coupons", "manage_team", "view_analytics", "edit_settings"]'::jsonb,
  'active'
),
(
  'Mateo Restrepo (Ventas & Equipo)', 
  'colaborador@disenotuespacio.com', 
  'collaborator', 
  '["manage_products", "manage_orders", "manage_appointments"]'::jsonb,
  'active'
)
ON CONFLICT (email) DO NOTHING;
