import { createClient } from '@supabase/supabase-js';

// Env variables with fallbacks for development mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-project.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-anon-key'
  );
};

export const checkSupabaseHealth = async (): Promise<{ isConnected: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      isConnected: false,
      message: 'Supabase no está configurado (falta archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Operando en modo de persistencia local ultrasincronizada.'
    };
  }

  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      return {
        isConnected: false,
        message: `Conexión rechazada por Supabase RLS o tabla no encontrada: ${error.message}`
      };
    }
    return {
      isConnected: true,
      message: 'Conexión activa y verificada con la nube Supabase Database en tiempo real.'
    };
  } catch (err: any) {
    return {
      isConnected: false,
      message: `Error de red conectando con Supabase: ${err.message || 'Desconocido'}`
    };
  }
};
