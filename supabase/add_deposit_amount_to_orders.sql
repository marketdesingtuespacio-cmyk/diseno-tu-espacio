-- ==============================================================================
-- ⚡ DISEÑO TU ESPACIO - MIGRACIÓN: CAMPOS DE ABONO / PAGO PARCIAL Y FACTURACIÓN
-- ==============================================================================

-- 1. Agregar columna deposit_amount (Monto del Abono / Pago Parcial)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12, 2) DEFAULT 0.00;

-- 2. Agregar columna pending_balance (Saldo Pendiente a Cobrar)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS pending_balance DECIMAL(12, 2) DEFAULT 0.00;

-- 3. Agregar columna payment_status (Estado de Pago: 'pending', 'partial', 'paid')
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- 4. Notificar actualización de esquema
COMMENT ON COLUMN public.orders.deposit_amount IS 'Monto del abono o pago parcial realizado por el cliente en COP';
COMMENT ON COLUMN public.orders.pending_balance IS 'Saldo restante pendiente por cobrar del pedido en COP';
COMMENT ON COLUMN public.orders.payment_status IS 'Estado del pago del pedido: pending (pendiente), partial (abono parcial), paid (pago completo)';
