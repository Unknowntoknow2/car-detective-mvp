import React, { createContext, useContext, useState, useEffect } from 'react';

// Extended User type to match what's expected in components
export type User = {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
  app_metadata: Record<string, any>; // Make this required
  user_metadata?: Record<string, any>;
  aud?: string;
} | null;

// Define a standard error type
type AuthError = {
  message: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User;
  session: any | null; // Add session property
  isLoading: boolean;
  error: string | null; // Add error property
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updatePassword: (password: string) => Promise<{ error?: AuthError }>; // Add updatePassword method
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<any>(null); // Add session state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Also set a mock session for compatibility
      setSession({
        user: JSON.parse(storedUser),
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000
      });
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user with extended properties
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: email.split('@')[0]
        },
        app_metadata: {
          provider: 'email'
        }
      };
      
      setUser(mockUser);
      
      // Set mock session
      const mockSession = {
        user: mockUser,
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000
      };
      setSession(mockSession);
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return {}; // Success case with no error
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: email.split('@')[0]
        },
        app_metadata: {
          provider: 'email'
        }
      };
      
      setUser(mockUser);
      
      // Set mock session
      const mockSession = {
        user: mockUser,
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000
      };
      setSession(mockSession);
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return {}; // Success case with no error
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setSession(null);
      localStorage.removeItem('auth_user');
    } catch (err: any) {
      console.error('Sign out error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Password reset email sent to ${email}`);
      return {}; // Success case with no error
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Add updatePassword method
  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password updated successfully');
      return {}; // Success case with no error
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update password';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
