
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserDetails, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // MVP: Basic sign in logic
      console.log('Sign in attempted for:', email);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setUserDetails(null);
      setUserRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userDetails,
      isLoading,
      userRole,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
