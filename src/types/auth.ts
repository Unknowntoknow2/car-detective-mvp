
export type UserRole = 'individual' | 'dealer' | 'admin';

export type AuthMode = 'signin' | 'signup' | 'reset-password';

export interface AuthContextType {
  user: any;
  session: any;
  userDetails: any;
  userRole?: UserRole;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, data?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  error?: any;
}
