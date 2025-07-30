import { createClient } from "@supabase/supabase-js";
export const supabase = createClient("SUPABASE_URL", "SUPABASE_ANON_KEY");
// TODO: Add functions to store/retrieve session and vehicle data
