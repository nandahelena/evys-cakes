import { createClient } from '@supabase/supabase-js';

// Cliente para Server Actions e Server Components: o navegador da cliente nunca fala com o banco.
export const supabaseServer = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!, {
    auth: { persistSession: false },
  });
