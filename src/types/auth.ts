
export enum AuthMode {
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot-password',
  FORGOT_EMAIL = 'forgot-email',
  RESET_PASSWORD = 'reset-password'
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  bio?: string;
  role?: UserRole;
  is_admin?: boolean;
  dealership_name?: string;
  dealership_id?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'user' | 'admin' | 'dealer';

export interface AuthFormProps {
  mode?: AuthMode;
  onSuccess?: () => void;
  redirectPath?: string;
}
