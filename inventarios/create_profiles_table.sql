-- SCRIPT OPCIONAL DE CREACIÓN DE TABLA 'profiles' EN SUPABASE SQL EDITOR
-- Si deseas guardar el equipo y colaboradores en Supabase Cloud DB:

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'collaborator',
  permissions JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
