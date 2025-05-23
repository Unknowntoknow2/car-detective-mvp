
export interface User {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string | null;
  isAdmin?: boolean;
  user_metadata?: {
    role?: string;
    full_name?: string;
    dealership_name?: string;
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
  dealership_name?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  email?: string;
}
