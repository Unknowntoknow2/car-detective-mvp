
export enum AuthMode {
  SIGNIN = "login",
  SIGNUP = "signup",
  FORGOT_PASSWORD = "reset-password",
  FORGOT_EMAIL = "forgot-email"
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
