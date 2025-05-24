
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserDetails } from '@/types/user';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const initialContext: AuthContextType = {
  user: null,
  userDetails: null,
  session: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isLoading: true,
  error: null
};

export const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage for mock auth
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const storedSession = localStorage.getItem('mockSession');
    const storedUserDetails = localStorage.getItem('mockUserDetails');

    if (storedUser && storedSession) {
      setUser(JSON.parse(storedUser));
      setSession(JSON.parse(storedSession));
      
      if (storedUserDetails) {
        setUserDetails(JSON.parse(storedUserDetails));
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock authentication
      const mockUser: User = {
        id: '123456',
        email: email,
        created_at: new Date().toISOString(),
        user_metadata: {
          role: 'individual',
          full_name: 'Test User',
        }
      };
      
      const mockUserDetails: UserDetails = {
        id: '123456',
        full_name: 'Test User',
        role: 'individual',
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-token',
        expires_at: Date.now() + 3600 * 1000
      };
      
      // Save to state
      setUser(mockUser);
      setUserDetails(mockUserDetails);
      setSession(mockSession);
      
      // Save to localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.setItem('mockUserDetails', JSON.stringify(mockUserDetails));
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      
      toast.success('Signed in successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For mock purposes, signUp behaves the same as signIn
      const role = options?.role || 'individual';
      const fullName = options?.fullName || 'New User';
      const dealershipName = options?.dealershipName;
      
      const mockUser: User = {
        id: '123456',
        email: email,
        created_at: new Date().toISOString(),
        user_metadata: {
          role: role,
          full_name: fullName,
          dealership_name: dealershipName
        }
      };
      
      const mockUserDetails: UserDetails = {
        id: '123456',
        full_name: fullName,
        role: role,
        dealership_name: dealershipName,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-token',
        expires_at: Date.now() + 3600 * 1000
      };
      
      // Save to state
      setUser(mockUser);
      setUserDetails(mockUserDetails);
      setSession(mockSession);
      
      // Save to localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.setItem('mockUserDetails', JSON.stringify(mockUserDetails));
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      
      toast.success('Sign up successful!');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      toast.error(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear state
      setUser(null);
      setUserDetails(null);
      setSession(null);
      
      // Clear localStorage
      localStorage.removeItem('mockUser');
      localStorage.removeItem('mockUserDetails');
      localStorage.removeItem('mockSession');
      
      toast.success('You have been signed out');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      toast.error(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userDetails, 
      session, 
      signIn, 
      signUp, 
      signOut, 
      isLoading, 
      error 
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
