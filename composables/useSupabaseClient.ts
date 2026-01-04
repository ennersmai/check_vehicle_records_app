import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const useSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;
  
  const config = useRuntimeConfig();
  
  supabaseInstance = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    }
  );

  return supabaseInstance;
};
