// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

// Define User type
export type User = {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; [key: string]: any };
  app_metadata?: { [key: string]: any };
  [key: string]: any;
};

// Define the AuthContextType
export type AuthContextType = {
  session: any | null;
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null } | undefined>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<{ data: any; error: Error | null } | undefined>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: Error | null } | undefined>;
  updatePassword: (password: string) => Promise<{ data: any; error: Error | null } | undefined>;
  getUserRole: () => Promise<UserRole | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', session.user.id)
            .single();
          setUserRole(data?.user_role as UserRole || 'individual');
        } else {
          setUserRole(null);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', session.user.id)
          .single();
        setUserRole(data?.user_role as UserRole || 'individual');
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true); setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', data.user.id)
          .single();
        setUserRole(profileData?.user_role as UserRole || 'individual');
      }

      toast.success('Successfully signed in!');
      return { data, error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      setError((err as Error).message || 'Failed to sign in');
      toast.error('Failed to sign in');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole = 'individual') => {
    setIsLoading(true); setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { role } }
      });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, user_role: role, email });
        if (profileError) console.error('Profile creation error:', profileError);
      }

      toast.success('Sign up successful!');
      return { data, error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      setError((err as Error).message || 'Failed to sign up');
      toast.error('Failed to sign up');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true); setError(null);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserRole(null);
      toast.success('Successfully signed out!');
    } catch (err) {
      console.error('Sign out error:', err);
      setError((err as Error).message || 'Failed to sign out');
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true); setError(null);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
      return { data, error: null };
    } catch (err) {
      console.error('Reset password error:', err);
      setError((err as Error).message || 'Failed to reset password');
      toast.error('Failed to reset password');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true); setError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully!');
      return { data, error: null };
    } catch (err) {
      console.error('Update password error:', err);
      setError((err as Error).message || 'Failed to update password');
      toast.error('Failed to update password');
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = async (): Promise<UserRole | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Get user role error:', error);
        setError(error.message || 'Failed to get user role');
        return null;
      }
      return data?.user_role as UserRole || null;
    } catch (err) {
      console.error('Get user role error:', err);
      setError((err as Error).message || 'Failed to get user role');
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        getUserRole
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      ) : (
        children
      )}
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
