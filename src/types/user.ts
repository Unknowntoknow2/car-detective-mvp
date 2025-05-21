
export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null; // Allow null but not undefined
  isAdmin: boolean;
}
