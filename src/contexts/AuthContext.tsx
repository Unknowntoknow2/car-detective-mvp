// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// 👤 User context shape
interface UserDetails {
  id: string;
  email?: string;
<<<<<<< HEAD
  user_metadata?: { full_name?: string; [key: string]: any };
  app_metadata?: { [key: string]: any };
  [key: string]: any;
};
=======
  role?: string;
  name?: string;
  avatar_url?: string;
}
>>>>>>> origin/main

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  userRole: string | null;
  loading: boolean;
  isLoading: boolean;
<<<<<<< HEAD
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
=======
  session: Session | null; // Add session property
  error: string | null; // Add error property
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
}

// 🌐 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ AuthProvider wrapper
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // Add session state
  const [error, setError] = useState<string | null>(null); // Add error state
  const isLoading = loading;
  const userRole = userDetails?.role || null;

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        setSession(session);
        setUser(session?.user || null);
>>>>>>> origin/main

        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role, full_name, avatar_url')
            .eq('id', session.user.id)
            .single();
<<<<<<< HEAD
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
=======

          if (data) {
            setUserDetails({
              id: data.id,
              email: data.email,
              role: data.role,
              name: data.full_name,
              avatar_url: data.avatar_url,
            });
          }
        }
      } catch (err: any) {
        console.error('Error getting user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
>>>>>>> origin/main
        const { data } = await supabase
          .from('profiles')
          .select('id, email, role, full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
<<<<<<< HEAD
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
=======
          
        if (data) {
          setUserDetails({
            id: data.id,
            email: data.email,
            role: data.role,
            name: data.full_name,
            avatar_url: data.avatar_url,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserDetails(null);
        setSession(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Sign-in error');
      return { success: false, error: error.message || 'Sign-in error' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
>>>>>>> origin/main
      });
      if (error) throw error;

      if (data.user) {
<<<<<<< HEAD
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
=======
        await supabase.from('profiles').upsert({
          id: data.user.id,
          role: 'individual',
          email,
          full_name: fullName,
        });
      }

      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Sign-up error');
      return { success: false, error: error.message || 'Sign-up error' };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
>>>>>>> origin/main
    }
  };

  const signOut = async () => {
<<<<<<< HEAD
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
=======
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
    setUserDetails(null);
    setSession(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      userDetails,
      userRole,
      loading,
      isLoading,
      session,
      error,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword
    }}>
      {children}
>>>>>>> origin/main
    </AuthContext.Provider>
  );
};

<<<<<<< HEAD
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
=======
// ✅ Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
>>>>>>> origin/main
  return context;
};
