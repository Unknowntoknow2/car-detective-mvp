
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    role?: string;
    full_name?: string;
    [key: string]: any;
  };
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  userDetails: any;
  userRole?: UserRole;
  error?: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, data?: any }>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  useEffect(() => {
    // Check for stored user info on mount
    const storedUser = localStorage.getItem('auth_user');
    const storedSession = localStorage.getItem('auth_session');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.user_metadata?.role as UserRole || 'individual');
      setUserDetails({
        role: parsedUser.user_metadata?.role || 'individual',
        full_name: parsedUser.user_metadata?.full_name,
      });
    }
    
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
    
    setIsLoading(false);
  }, []);
  
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an authentication API
      // For demo, we'll simulate a successful login
      const mockUser = {
        id: 'user123',
        email,
        name: email.split('@')[0],
        user_metadata: {
          role: 'individual',
          full_name: email.split('@')[0]
        },
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock_token',
        expires_at: Date.now() + 3600000, // 1 hour
      };
      
      // Store user info
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_session', JSON.stringify(mockSession));
      
      setUser(mockUser);
      setSession(mockSession);
      setUserRole(mockUser.user_metadata?.role as UserRole || 'individual');
      setUserDetails({
        role: mockUser.user_metadata?.role || 'individual',
        full_name: mockUser.user_metadata?.full_name,
      });
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, metadata?: any): Promise<{ error: any, data?: any }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an authentication API
      // For demo, we'll simulate a successful signup
      const mockUser = {
        id: 'user' + Date.now(),
        email,
        name: email.split('@')[0],
        user_metadata: {
          role: metadata?.role || 'individual',
          full_name: metadata?.full_name || email.split('@')[0]
        },
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock_token',
        expires_at: Date.now() + 3600000, // 1 hour
      };
      
      // Store user info
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_session', JSON.stringify(mockSession));
      
      setUser(mockUser);
      setSession(mockSession);
      setUserRole(mockUser.user_metadata?.role as UserRole || 'individual');
      setUserDetails({
        role: mockUser.user_metadata?.role || 'individual',
        full_name: mockUser.user_metadata?.full_name,
      });
      
      return { error: null, data: { user: mockUser } };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
    setUser(null);
    setSession(null);
    setUserDetails(null);
    setUserRole(undefined);
  };
  
  const resetPassword = async (email: string): Promise<{ error: any }> => {
    // Simulate password reset
    console.log('Password reset requested for:', email);
    return { error: null };
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userDetails, 
      userRole, 
      isLoading, 
      error, 
      signIn, 
      signUp, 
      signOut,
      resetPassword
    }}>
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
