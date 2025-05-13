
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with hardcoded values for browser environments
// In a production environment, you'd want to use environment variables securely
const supabaseUrl = "https://xltxqqzattxogxtqrggt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
