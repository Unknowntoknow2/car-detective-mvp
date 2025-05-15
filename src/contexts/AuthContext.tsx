
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

// Define User type
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  app_metadata?: {
    [key: string]: any;
  };
  [key: string]: any;
};

// Define the AuthContextType
export type AuthContextType = {
  session: any | null;
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null; // Adding the missing error property
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<{ data: any; error: Error | null; } | undefined>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  updatePassword: (password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  getUserRole: () => Promise<UserRole | null>;
};

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  // Setup Supabase auth state listener
  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If there's a user, fetch their role
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
    
    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If there's a user, fetch their role
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null); // Reset error state
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Fetch user role
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
    setIsLoading(true);
    setError(null); // Reset error state
    
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      });
      
      if (error) throw error;
      
      // If sign up is successful, create a profile with the role
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            user_role: role,
            email: email,
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
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
    setIsLoading(true);
    setError(null); // Reset error state
    
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
    setIsLoading(true);
    setError(null); // Reset error state
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
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
    setIsLoading(true);
    setError(null); // Reset error state
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      
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
        error, // Include error in the context value
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        getUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook for convenient access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
