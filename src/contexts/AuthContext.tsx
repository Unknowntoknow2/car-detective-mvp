
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

// Define types
type User = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    role?: string;
    full_name?: string;
    dealership_name?: string;
    [key: string]: any;
  };
} | null;

type UserDetails = {
  id: string;
  full_name?: string;
  role?: UserRole;
  dealership_name?: string;
  avatar_url?: string;
} | null;

interface AuthContextType {
  user: User;
  userDetails: UserDetails;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
  userRole: UserRole | string | null;
  signIn: (email: string, password: string) => Promise<{ error: any; success?: boolean }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any; success?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const userRole = userDetails?.role || user?.user_metadata?.role || null;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user details
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (!error && data) {
              setUserDetails(data);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        } else {
          setUserDetails(null);
        }
      }
    );

    // Check for existing session
    const checkUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user details
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (data) {
            setUserDetails(data);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { error, success: false };
      }
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to sign in');
      return { error, success: false };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setError(null);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        setError(error.message);
        return { error, success: false };
      }
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Failed to sign up');
      return { error, success: false };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message || 'Failed to sign out');
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        setError(error.message);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password');
      return { error };
    }
  };

  const value = {
    user,
    userDetails,
    isLoading,
    error,
    session,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
