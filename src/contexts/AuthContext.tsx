
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface UserDetails {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  dealership_name?: string;
  user_role?: string;
  is_premium_dealer?: boolean;
}

interface SignInResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile details
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            setUserDetails(profileData);
            setUserRole(profileData.user_role || profileData.role || null);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error during auth setup:', err);
        setIsLoading(false);
      }
    };

    // Call the async function
    setData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile details on auth state change
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (profileData) {
          setUserDetails(profileData);
          setUserRole(profileData.user_role || profileData.role || null);
        }
      } else {
        setUserDetails(null);
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Signed in successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Error signing in';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata?: Record<string, any>
  ): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: metadata ? { data: metadata } : undefined
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Sign up successful! Please check your email to verify your account.');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Error signing up';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        toast.error(error.message);
        throw error;
      }
      toast.success('You have been signed out');
    } catch (error: any) {
      const errorMessage = error?.message || 'Error signing out';
      setError(errorMessage);
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
        toast.error(error.message);
        throw error;
      }
      toast.success('Password reset email sent');
    } catch (error: any) {
      const errorMessage = error?.message || 'Error resetting password';
      setError(errorMessage);
      console.error('Error resetting password:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    userDetails,
    session,
    isLoading,
    error,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
