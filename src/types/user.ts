
export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null | undefined;
  isAdmin?: boolean;
}
