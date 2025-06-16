
import { useState, useEffect, createContext, useContext } from "react";

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

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const signUp = async (email: string, password: string) => {
    // Mock sign up
    setUser({ id: "1", email });
    setUserDetails({ role: "user" });
    setUserRole("user");
  };

  const resetPassword = async (email: string) => {
    // Mock reset password
    console.log("Password reset requested for:", email);
  };

  const signOut = async () => {
    setUser(null);
    setUserDetails(null);
    setUserRole(null);
  };

  const contextValue: AuthContextType = {
    user,
    userDetails,
    isLoading,
    userRole,
    signIn,
    signOut,
    signUp,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
