
// Basic auth types for MVP
export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export interface UserDetails {
  id: string;
  email: string;
  name?: string;
}

export type UserRole = 'user' | 'admin' | 'premium';
