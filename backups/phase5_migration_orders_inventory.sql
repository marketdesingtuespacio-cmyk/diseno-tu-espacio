-- ==============================================================================
-- 🚀 FASE 5: MIGRACIÓN DDL - TABLA NORMALIZADA `order_items` Y FUNCIÓN ATÓMICA DE INVENTARIO
-- Fecha: 2026-09-30
-- Proyecto: Diseño Tu Espacio
-- ==============================================================================

BEGIN;

-- 1. EXTENSIÓN UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREACIÓN DE LA TABLA NORMALIZADA `order_items`
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  product_snapshot JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ÍNDICES DE RENDIMIENTO PARA ACCESO EN BACK OFFICE Y ANALÍTICAS
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- 4. SEGURIDAD NIVEL DE FILA (RLS) EN `order_items`
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura (Consulta de ítems)
DROP POLICY IF EXISTS "Lectura de items de pedidos" ON public.order_items;
CREATE POLICY "Lectura de items de pedidos"
  ON public.order_items
  FOR SELECT
  USING (true);

-- Políticas de Gestión Completa para Usuarios Autenticados
DROP POLICY IF EXISTS "Gestion total de items de pedidos" ON public.order_items;
CREATE POLICY "Gestion total de items de pedidos"
  ON public.order_items
  FOR ALL
  USING (true);

-- 5. FUNCIÓN PL/pgSQL TRANSACCIONAL ATÓMICA DE CHECKOUT Y DEDUCCIÓN DE STOCK
CREATE OR REPLACE FUNCTION public.process_order_checkout(
  p_order_ref TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_customer_tag TEXT,
  p_shipping_address TEXT,
  p_city TEXT,
  p_carrier TEXT,
  p_payment_method TEXT,
  p_payment_gateway TEXT,
  p_subtotal DECIMAL,
  p_shipping_cost DECIMAL,
  p_discount DECIMAL,
  p_total DECIMAL,
  p_items JSONB
) RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_prod_id UUID;
  v_prod_sku TEXT;
  v_qty INT;
  v_unit_price DECIMAL;
  v_total_price DECIMAL;
  v_curr_stock INT;
BEGIN
  -- Insertar Cabecera de la Orden
  INSERT INTO public.orders (
    order_ref, customer_name, customer_email, customer_phone, customer_tag,
    shipping_address, city, carrier, subtotal, shipping_cost, discount,
    total, total_amount, status, payment_method, payment_gateway, items_count, items
  ) VALUES (
    p_order_ref, p_customer_name, p_customer_email, p_customer_phone, COALESCE(p_customer_tag, 'Residencial'),
    p_shipping_address, COALESCE(p_city, 'Bogotá D.C.'), COALESCE(p_carrier, 'Servientrega'),
    p_subtotal, p_shipping_cost, p_discount, p_total, p_total, 'processing',
    COALESCE(p_payment_method, 'Tarjeta de Crédito'), COALESCE(p_payment_gateway, 'Wompi Colombia'),
    jsonb_array_length(p_items), p_items
  ) RETURNING id INTO v_order_id;

  -- Procesar cada ítem de la orden de manera atómica
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_sku := v_item->>'sku';
    v_qty := (v_item->>'quantity')::INT;
    v_unit_price := (v_item->>'price')::DECIMAL;
    v_total_price := v_unit_price * v_qty;

    -- Buscar ID del producto por SKU o ID en la tabla products
    SELECT id, stock INTO v_prod_id, v_curr_stock 
    FROM public.products 
    WHERE (sku IS NOT NULL AND LOWER(sku) = LOWER(v_prod_sku))
       OR id::text = (v_item->>'product_id')
    LIMIT 1;

    -- Validar disponibilidad de stock
    IF v_prod_id IS NOT NULL THEN
      IF v_curr_stock < v_qty THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto SKU % (Disponible: %, Solicitado: %)', v_prod_sku, v_curr_stock, v_qty;
      END IF;

      -- Descuento Atómico de Stock
      UPDATE public.products
      SET stock = GREATEST(0, stock - v_qty),
          web_stock = GREATEST(0, web_stock - v_qty),
          inventory_status = CASE WHEN (stock - v_qty) <= 0 THEN 'Agotado' ELSE inventory_status END,
          updated_at = timezone('utc'::text, now())
      WHERE id = v_prod_id;
    END IF;

    -- Insertar Ítem en la Tabla Normalizada order_items
    INSERT INTO public.order_items (
      order_id, product_id, quantity, unit_price, total_price, product_snapshot
    ) VALUES (
      v_order_id, v_prod_id, v_qty, v_unit_price, v_total_price, v_item
    );
  END LOOP;

  RETURN v_order_id;
EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
