
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/hooks/useAuth';

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign in user: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing in:', error);
      } else {
        console.log('Sign in successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error in signIn:', err);
      return { 
        data: null, 
        error: new Error('Failed to sign in. Please try again later.') 
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign up user: ${email}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing up:', error);
      } else {
        console.log('Sign up successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error in signUp:', err);
      return { 
        data: null, 
        error: new Error('Failed to sign up. Please try again later.') 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (err) {
      console.error('Unexpected error in signOut:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      console.log(`[PasswordReset] Sending reset password email to ${email} with redirect to ${redirectUrl}`);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error('[PasswordReset] Error sending reset password email:', error);
      } else {
        console.log('[PasswordReset] Reset password email sent successfully');
      }
      
      return { data, error };
    } catch (err) {
      console.error('[PasswordReset] Unexpected error in resetPassword:', err);
      return { 
        data: null, 
        error: new Error('Failed to send reset password email. Please try again later.') 
      };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      console.log('Attempting to update password');
      const { data, error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) {
        console.error('Error updating password:', error);
      } else {
        console.log('Password updated successfully');
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error in updatePassword:', err);
      return { 
        data: null, 
        error: new Error('Failed to update password. Please try again later.') 
      };
    }
  };

  const getUserRole = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      console.log("Fetching user role for:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .maybeSingle(); // using maybeSingle to avoid errors if no profile
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      console.log("User role data:", data);
      return data?.user_role || null;
    } catch (err) {
      console.error("Error in getUserRole:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
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
