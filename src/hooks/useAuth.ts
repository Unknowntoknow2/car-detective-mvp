
import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface UserDetails {
  role?: string;
  full_name?: string;
  dealership_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    setUser({ id: "1", email });
    setUserDetails({ role: "user" });
    setUserRole("user");
  };

  const signOut = async () => {
    setUser(null);
    setUserDetails(null);
    setUserRole(null);
  };

  return {
    user,
    userDetails,
    isLoading,
    userRole,
    signIn,
    signOut,
  };
}
