-- ==============================================================================
-- 👤 REGISTRO Y ACTIVACIÓN DE ADMINISTRADORA: NATALIA ALCARAZ
-- Ejecuta este script en el Editor SQL de tu panel de Supabase para confirmar
-- el usuario en auth.users y habilitar su perfil en public.profiles con rol admin.
-- ==============================================================================

-- 1. Confirmar el correo en auth.users para que pueda iniciar sesión sin bloqueos
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW()),
    raw_user_meta_data = jsonb_build_object(
      'full_name', 'Natalia Alcaraz',
      'role', 'admin'
    )
WHERE email = 'nataliaalcarazcontadora@gmail.com';

-- 2. Asegurar que exista en public.profiles con rol 'admin' y todos los permisos de gestión
INSERT INTO public.profiles (id, full_name, email, role, permissions, status)
SELECT 
  id,
  'Natalia Alcaraz',
  'nataliaalcarazcontadora@gmail.com',
  'admin',
  '["manage_products", "manage_orders", "manage_appointments", "manage_coupons", "manage_team", "view_analytics", "edit_settings"]'::jsonb,
  'active'
FROM auth.users
WHERE email = 'nataliaalcarazcontadora@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin',
    full_name = 'Natalia Alcaraz',
    permissions = '["manage_products", "manage_orders", "manage_appointments", "manage_coupons", "manage_team", "view_analytics", "edit_settings"]'::jsonb,
    status = 'active';

-- Verificar el resultado
SELECT id, full_name, email, role, status, permissions 
FROM public.profiles 
WHERE email = 'nataliaalcarazcontadora@gmail.com';
