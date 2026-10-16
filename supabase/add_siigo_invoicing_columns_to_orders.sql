-- ==============================================================================
-- ⚡ DISEÑO TU ESPACIO - ESTRUCTURA PARA FACTURACIÓN ELECTRÓNICA SIIGO NUBE
-- ==============================================================================
-- Esta migración prepara la tabla 'orders' para recibir los identificadores fiscales
-- emitidos por SIIGO y aprobados por la DIAN cuando el pago es por BOLD.

-- 1. Documento de Identidad del Cliente (Cédula / NIT requerido por la DIAN)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_document_type TEXT DEFAULT 'CC', -- CC, NIT, CE, etc.
ADD COLUMN IF NOT EXISTS customer_document_id TEXT DEFAULT '';

-- 2. Identificadores de Factura Electrónica emitidos por Siigo
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS siigo_invoice_id TEXT DEFAULT NULL,       -- ID interno del comprobante en Siigo (UUID de Siigo)
ADD COLUMN IF NOT EXISTS siigo_invoice_number TEXT DEFAULT NULL,   -- Prefijo + Consecutivo (ej: FE-1045)
ADD COLUMN IF NOT EXISTS siigo_invoice_status TEXT DEFAULT NULL,   -- 'pending', 'generated', 'failed', 'not_applicable'
ADD COLUMN IF NOT EXISTS siigo_cufe TEXT DEFAULT NULL,             -- Código Único de Facturación Electrónica DIAN
ADD COLUMN IF NOT EXISTS siigo_pdf_url TEXT DEFAULT NULL,         -- Enlace para descargar el PDF oficial de la factura
ADD COLUMN IF NOT EXISTS siigo_error_log TEXT DEFAULT NULL;       -- Registro de error en caso de rechazo para fácil auditoría

-- 3. Documentación y comentarios en el diccionario de datos
COMMENT ON COLUMN public.orders.customer_document_type IS 'Tipo de documento fiscal DIAN (CC, NIT, CE, TI, etc.)';
COMMENT ON COLUMN public.orders.customer_document_id IS 'Número de identificación fiscal del cliente para factura electrónica';
COMMENT ON COLUMN public.orders.siigo_invoice_id IS 'UUID de la factura de venta en Siigo Nube';
COMMENT ON COLUMN public.orders.siigo_invoice_number IS 'Número consecutivo de la factura electrónica DIAN (ej: FV-120)';
COMMENT ON COLUMN public.orders.siigo_invoice_status IS 'Estado de la factura electrónica: pending, generated, failed, not_applicable';
COMMENT ON COLUMN public.orders.siigo_cufe IS 'Código Único de Facturación Electrónica (CUFE) expedido ante la DIAN';
COMMENT ON COLUMN public.orders.siigo_pdf_url IS 'URL pública o de Siigo del PDF de la factura electrónica';
COMMENT ON COLUMN public.orders.siigo_error_log IS 'Detalle del error si Siigo o la DIAN rechazan algún dato';
