import { createClient } from "@supabase/supabase-js";
const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
    
}
export const supabase = createClient(url, key, {
    auth: { persistSession: false }
});
