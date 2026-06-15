import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔥 DEBUG (coloca aqui)
console.log('ENV URL:', supabaseUrl);
console.log('ENV KEY:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('❌ Variáveis do Supabase não carregaram. Verifique o .env e reinicie o Vite.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
