
export type UserRole = 'admin' | 'dealer' | 'individual';

export type AuthMode = 'signin' | 'signup' | 'reset';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  dealershipName?: string;
  role?: UserRole;
  acceptTerms?: boolean;
}
