
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    role?: 'individual' | 'dealer';
  };
}

export interface UserDetails {
  id: string;
  full_name?: string;
  role?: 'individual' | 'dealer' | 'admin';
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  loading: boolean;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Sign in:', { email, password });
    // Mock sign in logic
    const mockUser: User = {
      id: '1',
      email,
      user_metadata: { role: 'individual' }
    };
    const mockDetails: UserDetails = {
      id: '1',
      email,
      role: 'individual'
    };
    setUser(mockUser);
    setUserDetails(mockDetails);
  };

  const signUp = async (email: string, password: string) => {
    console.log('Sign up:', { email, password });
    // Mock sign up logic
  };

  const signOut = async () => {
    setUser(null);
    setUserDetails(null);
  };

  const resetPassword = async (email: string) => {
    console.log('Reset password for:', email);
    // Mock reset password logic
  };

  return (
    <AuthContext.Provider value={{
      user,
      userDetails,
      loading,
      isLoading: loading,
      userRole: userDetails?.role || null,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
