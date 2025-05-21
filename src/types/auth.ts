
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
  role?: string;
  is_admin?: boolean;
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

export interface AuthContextType {
  session: any;
  user: any;
  profile: UserProfile | null;
  userRole?: UserRole | string | null;
  isLoading: boolean;
  loading?: boolean;
  error: string | null;
  signUp: (email: string, password: string, phone?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<any>;
  sendMagicLink?: (email: string) => Promise<void>;
  updateProfile?: (profile: UserProfile) => Promise<void>;
  userDetails?: any;
}
