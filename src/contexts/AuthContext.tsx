
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface UserDetails {
  id: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Placeholder implementation
    setUser({ id: '1', email });
    setIsLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        isLoading,
        userRole: userDetails?.role || null,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
