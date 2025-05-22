
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserProfile, UserRole } from '@/types/auth';
import { errorToString } from '@/utils/errorHandling';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  userDetails: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  } | void>;
  signUp: (email: string, password: string, userData?: any) => Promise<{
    error: any | null;
    data: any | null;
  } | void>;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading for backward compatibility
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in, fetch their role and profile
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // First check metadata for role
      const { data: userData } = await supabase.auth.getUser();
      const roleFromMetadata = userData?.user?.user_metadata?.role;
      
      if (roleFromMetadata) {
        setUserRole(roleFromMetadata as UserRole);
        return;
      }
      
      // Fallback to profiles table if not in metadata
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('individual'); // Default role
        return;
      }

      setUserRole(data.role as UserRole);
    } catch (err) {
      console.error('Error in fetchUserRole:', err);
      setUserRole('individual'); // Default role
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      // Convert Date objects to strings for UserProfile compatibility
      if (data) {
        const profile: UserProfile = {
          ...data,
          created_at: typeof data.created_at === 'string' ? data.created_at : new Date(data.created_at).toISOString(),
          updated_at: typeof data.updated_at === 'string' ? data.updated_at : new Date(data.updated_at).toISOString(),
        };
        setUserDetails(profile);
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', errorToString(err));
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { error, data: null };
      }
      
      // Fetch user role and profile to properly redirect
      if (data.user) {
        await fetchUserRole(data.user.id);
        await fetchUserProfile(data.user.id);
        
        // Role-based redirect handled by the component calling this function
        toast.success('Successfully signed in');
      }
      
      return { error: null, data };
    } catch (err: any) {
      setError(err.message || 'Signin failed');
      return { error: err.message || 'Signin failed', data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ensure role is set to a default if not provided
      const role = userData?.role || 'individual';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role
          }
        }
      });
      
      if (error) {
        setError(error.message);
        return { error, data: null };
      }
      
      toast.success('Signup successful! Please check your email for confirmation.');
      return { error: null, data };
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return { error: err.message || 'Signup failed', data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserDetails(null);
      setUserRole(null);
      toast.success('Successfully signed out');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Signout failed');
      toast.error(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) throw error;
      toast.success('Magic link sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
      toast.error(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      toast.success('Password updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    userRole,
    userDetails,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
    resetPassword,
    updatePassword,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
  };

  return (
    <AuthContext.Provider value={value}>
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
