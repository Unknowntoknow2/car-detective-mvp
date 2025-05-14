
export type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'forgot-email';
export type AuthType = 'email' | 'phone';
export type UserRole = 'individual' | 'dealer' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  role?: UserRole;
  full_name?: string;
  dealership_name?: string;
  avatar_url?: string;
  premium_expires_at?: string | null;
}
