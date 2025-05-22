
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userDetails: {
    role?: UserRole;
    full_name?: string;
    dealership_name?: string;
    id?: string;
  } | null;
  userRole?: UserRole; // Added for backward compatibility
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<AuthContextType['userDetails']>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserDetails = async (userId: string) => {
    try {
      // First try to get from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error in fetchUserDetails:', err);
      return null;
    }
  };

  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userData = await fetchUserDetails(session.user.id);
        const role = userData?.role || session.user.user_metadata?.role as UserRole;
        
        setUserDetails({
          id: session.user.id,
          // Get role from profiles table or from user metadata
          role: role,
          full_name: userData?.full_name || session.user.user_metadata?.full_name,
          dealership_name: userData?.dealership_name || session.user.user_metadata?.dealership_name
        });
        
        // Set userRole for backward compatibility
        setUserRole(role);
      } else {
        setUserDetails(null);
        setUserRole(undefined);
      }
      
      setIsLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userData = await fetchUserDetails(session.user.id);
        const role = userData?.role || session.user.user_metadata?.role as UserRole;
        
        setUserDetails({
          id: session.user.id,
          // Get role from profiles table or from user metadata
          role: role,
          full_name: userData?.full_name || session.user.user_metadata?.full_name,
          dealership_name: userData?.dealership_name || session.user.user_metadata?.dealership_name
        });
        
        // Set userRole for backward compatibility
        setUserRole(role);
      }
      
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
        return { error: error.message };
      }
      
      // User successfully signed in
      toast.success('Successfully signed in!');
      return {};
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An error occurred during sign in');
      return { error: err.message || 'An error occurred during sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
        },
      });

      if (error) {
        setError(error.message);
        return { error: error.message };
      }
      
      toast.success('Sign up successful! Please check your email for confirmation.');
      return {};
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An error occurred during sign up');
      return { error: err.message || 'An error occurred during sign up' };
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

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userDetails,
        userRole, // Added for backward compatibility
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
