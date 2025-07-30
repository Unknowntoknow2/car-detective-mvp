import { createClient } from '@supabase/supabase-js';
<<<<<<< HEAD
const supabaseUrl = 'https://bmpwwtgtwxxuabuhkami.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcHd3dGt3eHh1YWJ1aGthbWkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNjc3NjAyMSwiZXhwIjoyMDYyMzUyMDIxfQ.T1e1c1AA8c3-ISUdHZNDX4AbFImCVwUbWxP7O9R9TDQ';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
=======
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
>>>>>>> main
