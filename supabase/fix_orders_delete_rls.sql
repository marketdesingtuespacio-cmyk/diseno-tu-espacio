-- ==============================================================================
-- ⚡ DISEÑO TU ESPACIO - POLÍTICA RLS PARA BORRADO DE PEDIDOS Y SUB-TABLAS
-- ==============================================================================

-- 1. Habilitar la política de eliminación (DELETE) en la tabla principal de órdenes
DROP POLICY IF EXISTS "Permitir eliminar ordenes" ON public.orders;
CREATE POLICY "Permitir eliminar ordenes" ON public.orders FOR DELETE USING (true);

-- 2. Habilitar la política de eliminación (DELETE) en la tabla de ítems relacionales (si existe)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Permitir eliminar order_items" ON public.order_items';
    EXECUTE 'CREATE POLICY "Permitir eliminar order_items" ON public.order_items FOR DELETE USING (true)';
  END IF;
END $$;
