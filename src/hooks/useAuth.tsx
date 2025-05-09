
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

// Define the shape of our auth context
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use try/catch to handle the case where Router might not be available
  let navigate: NavigateFunction | undefined;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("Router context not available. Navigation will be limited.");
  }
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }
      
      if (navigate) navigate('/dashboard');
      toast.success('Successfully signed in!');
      return {};
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred during sign in';
      setError(errorMsg);
      toast.error(errorMsg);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }
      
      toast.success('Sign up successful! Please check your email for confirmation.');
      return {};
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred during sign up';
      setError(errorMsg);
      toast.error(errorMsg);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      if (navigate) navigate('/');
      toast.success('Successfully signed out!');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
