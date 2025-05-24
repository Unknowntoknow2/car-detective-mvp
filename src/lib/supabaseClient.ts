
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to placeholders for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xltxqqzattxogxtqrggt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY';

// Create a singleton instance of the Supabase client
// We use let here so the instance can be mocked in tests if needed
let instance = null;

export const getSupabaseClient = () => {
  if (instance) return instance;
  
  instance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'car-detective-auth-storage' // Unique storage key to prevent conflicts
    }
  });
  
  return instance;
};

// For backward compatibility
export const supabase = getSupabaseClient();
