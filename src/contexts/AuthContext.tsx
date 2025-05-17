
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '@/types/auth';
import { toast } from 'sonner';

// Define the shape of our Auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  userDetails: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoading = loading;
  const userRole = userDetails?.role as UserRole || null;

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in, fetch their details
      if (session?.user) {
        fetchUserDetails(session.user.id);
      } else {
        setUserDetails(null);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserDetails(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, full_name, avatar_url, dealership_name, premium_expires_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
        return;
      }

      if (data) {
        setUserDetails({
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          dealership_name: data.dealership_name,
          premium_expires_at: data.premium_expires_at
        });
      }
    } catch (err) {
      console.error('Error in fetchUserDetails:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Successfully signed in!');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            role: 'individual'
          }
        }
      });

      if (error) throw error;

      toast.success('Successfully signed up! Please check your email for confirmation.');
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userDetails,
      userRole,
      loading,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
