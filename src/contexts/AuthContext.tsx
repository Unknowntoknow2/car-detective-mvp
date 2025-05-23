
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

interface AuthContextType {
  user: any | null;
  userDetails: UserDetails | null;
  session: any | null;
  isLoading: boolean;
  userRole: UserRole | null; // Add userRole property
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserDetails: (details: Partial<UserDetails>) => Promise<void>;
  error?: string | null; // Add error property
}

interface UserDetails {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  email?: string;
  dealership_name?: string;
  premium_access?: boolean;
  created_at?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive userRole from userDetails for easier access
  const userRole = userDetails?.role || null;

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Get user profile details
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error getting profile:', profileError);
            setError(profileError.message);
          } else if (data) {
            setUserDetails({
              id: session.user.id,
              full_name: data.full_name,
              avatar_url: data.avatar_url,
              role: data.role,
              email: session.user.email,
              dealership_name: data.dealership_name,
              premium_access: data.premium_access,
              created_at: data.created_at
            });
          }
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Get user profile details when auth state changes
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error getting profile on auth change:', error);
            setError(error.message);
          } else if (data) {
            setUserDetails({
              id: session.user.id,
              full_name: data.full_name,
              avatar_url: data.avatar_url,
              role: data.role,
              email: session.user.email,
              dealership_name: data.dealership_name,
              premium_access: data.premium_access,
              created_at: data.created_at
            });
          }
        } else {
          setUserDetails(null);
        }
      }
    );

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        throw error;
      }
      setUser(null);
      setSession(null);
      setUserDetails(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateUserDetails = async (details: Partial<UserDetails>) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(details)
        .eq('id', user.id);

      if (error) {
        setError(error.message);
        throw error;
      }

      // Update local state
      setUserDetails(prev => prev ? { ...prev, ...details } : null);
    } catch (error: any) {
      console.error('Error updating user details:', error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    userDetails,
    session,
    isLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    updateUserDetails,
    error,
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
