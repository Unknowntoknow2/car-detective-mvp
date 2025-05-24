
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserDetails } from '@/types/user';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface AuthResult {
  success: boolean;
  error?: string | null;
}

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, options?: any) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  userRole?: UserRole | string;
}

const initialContext: AuthContextType = {
  user: null,
  userDetails: null,
  session: null,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  isLoading: true,
  error: null,
  userRole: undefined
};

export const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | string | undefined>(undefined);

  // Initialize auth state from localStorage for mock auth
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const storedSession = localStorage.getItem('mockSession');
    const storedUserDetails = localStorage.getItem('mockUserDetails');

    if (storedUser && storedSession) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession(JSON.parse(storedSession));
      
      // Set user role from user metadata
      setUserRole(parsedUser?.user_metadata?.role || 'individual');
      
      if (storedUserDetails) {
        const parsedDetails = JSON.parse(storedUserDetails);
        setUserDetails(parsedDetails);
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
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
      setUserRole(mockUser.user_metadata?.role || 'individual');
      
      // Save to localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.setItem('mockUserDetails', JSON.stringify(mockUserDetails));
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      
      toast.success('Signed in successfully!');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: any): Promise<AuthResult> => {
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
      setUserRole(role);
      
      // Save to localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.setItem('mockUserDetails', JSON.stringify(mockUserDetails));
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      
      toast.success('Sign up successful!');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
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
      setUserRole(undefined);
      
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
      error,
      userRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook for easy consumption by components
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
