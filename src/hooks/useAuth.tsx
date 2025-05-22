
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
};

type UserDetails = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  role?: 'individual' | 'dealer' | 'admin';
};

type AuthContextType = {
  session: any | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Get user details from profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileData) {
              setUserDetails({
                id: session.user.id,
                full_name: profileData.full_name || session.user.user_metadata?.full_name,
                avatar_url: profileData.avatar_url || session.user.user_metadata?.avatar_url,
                email: session.user.email,
                role: profileData.role || session.user.user_metadata?.role || 'individual',
              });
            } else {
              // Use metadata if profile not found
              setUserDetails({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name,
                avatar_url: session.user.user_metadata?.avatar_url,
                email: session.user.email,
                role: session.user.user_metadata?.role || 'individual',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error in auth provider:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    userDetails,
    isLoading,
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

export default useAuth;
