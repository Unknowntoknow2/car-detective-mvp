
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserDetails {
  id: string;
  full_name?: string;
  role?: 'individual' | 'dealer' | 'admin';
  email?: string;
  dealership_name?: string;
  is_premium_dealer?: boolean;
  premium_expires_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userDetails: UserDetails | null;
  loading: boolean;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, options?: { role?: string; dealershipName?: string }) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profile) {
        setUserDetails({
          id: userId,
          full_name: profile.full_name,
          role: userRole?.role || profile.role || 'individual',
          email: user?.email,
          dealership_name: profile.dealership_name,
          is_premium_dealer: profile.is_premium_dealer,
          premium_expires_at: profile.premium_expires_at,
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserDetails(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent deadlocks
          setTimeout(() => {
            if (mounted) {
              fetchUserDetails(session.user.id);
            }
          }, 0);
        } else {
          setUserDetails(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          if (mounted) {
            fetchUserDetails(session.user.id);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, options?: { role?: string; dealershipName?: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: options?.role || 'individual',
            dealership_name: options?.dealershipName,
          }
        }
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userDetails,
      loading,
      isLoading: loading,
      userRole: userDetails?.role || null,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      resetPassword,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
