
// src/hooks/useAuth.ts
import { useContext, createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  resetPassword: (email: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  updatePassword: (password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
};

// This creates a custom hook for accessing auth functionality
export function useAuth() {
  const context = useContext(createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    resetPassword: async () => undefined,
    updatePassword: async () => undefined,
  }));

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // If your resetPassword function doesn't exist in context, implement it here
  const resetPassword = async (email: string) => {
    try {
      // Make sure to include the redirectTo parameter with the correct URL
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      console.log(`Sending reset password email to ${email} with redirect to ${redirectUrl}`);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error('Error sending reset password email:', error);
      } else {
        console.log('Reset password email sent successfully');
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error in resetPassword:', err);
      return { 
        data: null, 
        error: new Error('Failed to send reset password email. Please try again later.') 
      };
    }
  };

  // If your updatePassword function doesn't exist in context, implement it here
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

  // Return the context with the added functions if they don't exist
  return {
    ...context,
    resetPassword: context.resetPassword || resetPassword,
    updatePassword: context.updatePassword || updatePassword,
  };
}
