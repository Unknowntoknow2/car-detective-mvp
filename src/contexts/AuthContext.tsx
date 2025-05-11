import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Export the User type for use in other files
export type User = SupabaseUser & {
  email?: string;
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata?: {
    full_name?: string;
    user_role?: 'user' | 'dealer';
    [key: string]: any;
  };
  aud?: string;
  created_at?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state listener");

    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session ? "session exists" : "no session");
      setSession(session);
      setUser(session?.user as User | null);
      setIsLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "session exists" : "no session");
      setSession(session);
      setUser(session?.user as User | null);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // After successful login, check if user is a dealer
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', data.user.id)
          .single();
          
        if (profileData?.user_role === 'dealer') {
          navigate('/dealer-dashboard');
        } else {
          // Default navigation for regular users
          toast.success('Successfully signed in!');
        }
        
        // Successful login will trigger the onAuthStateChange listener
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, phone?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone_number: phone,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Sign up successful! Please check your email for confirmation.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Successfully signed out!');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });

      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An error occurred while requesting a password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An error occurred while updating your password');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isLoading,
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
