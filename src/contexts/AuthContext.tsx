
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userDetails: any;
  userRole: string | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, options?: any) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to prevent deadlock
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              setUserDetails(profile);
              setUserRole(profile?.role || 'individual');
            } catch (err) {
              console.error('Error fetching profile:', err);
              setUserRole('individual');
            }
          }, 0);
        } else {
          setUserDetails(null);
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Successfully signed in!');
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  const signUp = async (email: string, password: string, options?: any): Promise<AuthResult> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Sign up successful! Please check your email.');
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully signed out!');
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userDetails,
      userRole,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
    }}>
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
