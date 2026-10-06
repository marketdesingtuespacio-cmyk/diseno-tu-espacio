-- ==============================================================================
-- ⚡ DISEÑO TU ESPACIO - MIGRACIÓN: CREACIÓN DE BUCKET PRODUCT-IMAGES EN SUPABASE
-- ==============================================================================

-- 1. Crear el bucket de almacenamiento public 'product-images' si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB límite
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Habilitar políticas de seguridad RLS para lectura pública y subida directa
DROP POLICY IF EXISTS "Public Read Access on product-images" ON storage.objects;
CREATE POLICY "Public Read Access on product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Insert Access on product-images" ON storage.objects;
CREATE POLICY "Public Insert Access on product-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Update Access on product-images" ON storage.objects;
CREATE POLICY "Public Update Access on product-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Delete Access on product-images" ON storage.objects;
CREATE POLICY "Public Delete Access on product-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
