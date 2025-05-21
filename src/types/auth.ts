export enum AuthMode {
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot-password',
  FORGOT_EMAIL = 'forgot-email',
  RESET_PASSWORD = 'reset-password'
}

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  DEALER = 'dealer'
}

export interface AuthFormProps {
  mode?: AuthMode;
  onSuccess?: () => void;
  redirectUrl?: string;
}
