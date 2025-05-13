
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Define User type
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  app_metadata?: {
    [key: string]: any;
  };
  [key: string]: any;
};

// Define the AuthContextType
export type AuthContextType = {
  session: any | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  updatePassword: (password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  getUserRole: () => Promise<string | null>;
};

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock implementation for testing
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    console.log(`Mock sign in with ${email}`);
    
    try {
      // For test/demo purposes
      const mockUser = {
        id: '123456',
        email: email,
        user_metadata: {
          full_name: 'Test User'
        },
        created_at: new Date().toISOString()
      };
      
      // Simulate successful login
      setUser(mockUser);
      setSession({ user: mockUser });
      toast.success('Successfully signed in!');
      
      return { data: { user: mockUser }, error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      toast.error('Failed to sign in');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    console.log(`Mock sign up with ${email}`);
    
    try {
      toast.success('Sign up successful!');
      return { data: {}, error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      toast.error('Failed to sign up');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    console.log('Mock sign out');
    
    try {
      setUser(null);
      setSession(null);
      toast.success('Successfully signed out!');
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    console.log(`Mock reset password for ${email}`);
    
    try {
      toast.success('Password reset instructions sent to your email');
      return { data: {}, error: null };
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Failed to reset password');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    console.log('Mock update password');
    
    try {
      toast.success('Password updated successfully!');
      return { data: {}, error: null };
    } catch (err) {
      console.error('Update password error:', err);
      toast.error('Failed to update password');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = async (): Promise<string | null> => {
    console.log('Mock get user role');
    return user ? 'user' : null;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        getUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook for convenient access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
