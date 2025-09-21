
// Re-export the unified supabase client
import { supabase } from '@/lib/supabase/client';
export { supabase };

export const getSupabaseClient = () => supabase;
