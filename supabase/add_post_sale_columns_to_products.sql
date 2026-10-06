-- ==============================================================================
-- ⚡ DISEÑO TU ESPACIO - MIGRACIÓN: COLUMNAS DE POST-VENTA EN TABLA PRODUCTS
-- ==============================================================================

-- Agregar columnas faltantes en la tabla products si no existen
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_returns_info text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_instructions text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fast_shipping_badge text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS returns_policy_badge text DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_price numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_min_qty integer DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_by text DEFAULT '';
