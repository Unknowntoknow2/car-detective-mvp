
import { useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define the AuthContextType
export type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  updatePassword: (password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  getUserRole: () => Promise<string | null>;
};

/**
 * Custom hook for accessing authentication context
 * Ensures the auth context is available and provides necessary auth functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Implementation of getUserRole if it doesn't exist in context
  const getUserRole = async (): Promise<string | null> => {
    if (!context.user) return null;
    
    try {
      console.log("Fetching user role for:", context.user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', context.user.id)
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

  // Implementation of signIn if it doesn't exist in context
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

  // Implementation of signUp if it doesn't exist in context
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

  // Implementation of signOut if it doesn't exist in context
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

  // Implementation of resetPassword if it doesn't exist in context
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

  // Implementation of updatePassword if it doesn't exist in context
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

  // Return the context with fallback implementations for missing functions
  return {
    ...context,
    signIn: context.signIn || signIn,
    signUp: context.signUp || signUp,
    signOut: context.signOut || signOut,
    resetPassword: context.resetPassword || resetPassword,
    updatePassword: context.updatePassword || updatePassword,
    getUserRole: context.getUserRole || getUserRole,
    isLoading: context.isLoading || false, // Use only isLoading, not loading
  };
};
