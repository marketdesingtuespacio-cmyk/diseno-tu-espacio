-- SCRIPT DE CREACIÓN Y CONFIGURACIÓN DE TABLA 'orders' EN SUPABASE SQL EDITOR
-- Copiar y ejecutar en Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_ref TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_tag TEXT DEFAULT 'Residencial',
  shipping_address TEXT,
  city TEXT DEFAULT 'Bogotá D.C.',
  carrier TEXT DEFAULT 'Servientrega',
  tracking_number TEXT,
  subtotal NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'processing',
  payment_method TEXT,
  payment_gateway TEXT,
  items_count INT DEFAULT 1,
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurar políticas de seguridad RLS habilitadas para lectura e inserción pública
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public order insertion" ON orders;
CREATE POLICY "Allow public order insertion" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public order select" ON orders;
CREATE POLICY "Allow public order select" ON orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public order update" ON orders;
CREATE POLICY "Allow public order update" ON orders
  FOR UPDATE USING (true);
