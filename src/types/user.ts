
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at: string | null;
  isAdmin?: boolean;
  profile?: UserProfile;
  user_role?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  user_role?: 'admin' | 'user' | 'dealer';
}
