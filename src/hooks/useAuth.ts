
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserDetails {
  id: string;
  email?: string;
  role?: string;
  name?: string;
  avatar_url?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  // Add isLoading as an alias for loading for compatibility with other components
  const isLoading = loading;
  // Add userRole derived from userDetails.role
  const userRole = userDetails?.role || null;

  useEffect(() => {
    // Get current user and set in state
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Get user profile details from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role, username, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (data) {
            setUserDetails({
              id: data.id,
              email: data.email || user.email,
              role: data.role,
              name: data.username,
              avatar_url: data.avatar_url
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Get user profile details
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, role, username, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        if (!error && data) {
          setUserDetails({
            id: data.id,
            email: data.email || session.user.email,
            role: data.role,
            name: data.username,
            avatar_url: data.avatar_url
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserDetails(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Update the auth functions to return error information
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during sign in' 
      };
    }
  };

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during sign up' 
      };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred while resetting password' 
      };
    }
  };

  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred while updating password' 
      };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    userDetails,
    loading,
    isLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
}

export default useAuth;
