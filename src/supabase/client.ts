import { createClient } from '@supabase/supabase-js';

// Acceso seguro a variables de entorno para evitar crasheos si faltan
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_KEY en el archivo .env');
}

// Bandera para verificar configuración en la UI
export const isSupabaseConfigured = supabaseUrl && supabaseKey && supabaseUrl !== 'PON_TU_URL_AQUI';

// Inicialización del cliente con fallbacks para evitar error fatal al inicio
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);
