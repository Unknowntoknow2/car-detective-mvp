// ✅ File: src/types/auth.ts

<<<<<<< HEAD
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
=======
export type UserRole = "admin" | "dealer" | "individual";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  dealership_name?: string;
  premium_expires_at?: string | null;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

// ✅ Add this to fix `AuthMode` error:
export enum AuthMode {
  SIGN_IN = "signin",
  SIGN_UP = "signup",
}
