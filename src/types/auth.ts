
export type UserRole = "user" | "dealer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
