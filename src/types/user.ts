
export interface User {
  id: string;
  email?: string; // Changed from required to optional to match Supabase User type
  created_at?: string; // Made optional to match Supabase User type
  last_sign_in_at?: string | null;
  isAdmin?: boolean;
  user_metadata?: {
    role?: string;
    full_name?: string;
    dealership_name?: string; // Added dealership_name
    [key: string]: any;
  };
}

export interface UserDetails {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  bio?: string | null;
  role?: string;
  dealership_name?: string; // Added dealership_name
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  email?: string;
}
