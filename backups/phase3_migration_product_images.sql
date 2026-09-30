-- ==============================================================================
-- 🚀 FASE 3: MIGRACIÓN DDL ARQUITECTÓNICA - TABLA NORMALIZADA `product_images`
-- Y CONFIGURACIÓN DEL BUCKET SUPABASE STORAGE (`product-images`)
-- Fecha: 2026-09-30
-- Proyecto: Diseño Tu Espacio
-- ==============================================================================

BEGIN;

-- 1. EXTENSIÓN UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREACIÓN DE LA TABLA RELACIONAL `product_images`
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ÍNDICES DE RENDIMIENTO PARA ACCESO RÁPIDO EN CONSULTAS DEL CATÁLOGO
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_position ON public.product_images(position);

-- 4. SEGURIDAD NIVEL DE FILA (RLS) EN `product_images`
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Política de Lectura Pública (Cualquier cliente puede visualizar las fotos del producto)
DROP POLICY IF EXISTS "Lectura publica de imagenes de productos" ON public.product_images;
CREATE POLICY "Lectura publica de imagenes de productos" 
  ON public.product_images 
  FOR SELECT 
  USING (true);

-- Política de Gestión Completa (Insertar, Actualizar, Borrar para Administradores y Colaboradores)
DROP POLICY IF EXISTS "Gestion total de imagenes para usuarios autenticados" ON public.product_images;
CREATE POLICY "Gestion total de imagenes para usuarios autenticados" 
  ON public.product_images 
  FOR ALL 
  USING (true);

-- 5. CREACIÓN Y CONFIGURACIÓN DEL BUCKET DE SUPABASE STORAGE (`product-images`)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 
  'product-images', 
  true, 
  5242880, -- Límite de 5 MB por archivo de imagen
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- POLÍTICAS RLS EN `storage.objects` PARA EL BUCKET `product-images`
DROP POLICY IF EXISTS "Acceso publico de lectura al bucket product-images" ON storage.objects;
CREATE POLICY "Acceso publico de lectura al bucket product-images"
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Permiso de subida y gestion al bucket product-images" ON storage.objects;
CREATE POLICY "Permiso de subida y gestion al bucket product-images"
  ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'product-images');

COMMIT;
