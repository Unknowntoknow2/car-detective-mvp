
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

interface AuthContextType {
  user: any | null;
  userDetails: UserDetails | null;
  session: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserDetails: (details: Partial<UserDetails>) => Promise<void>;
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

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
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
      } catch (error) {
        console.error('Auth error:', error);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserDetails = async (details: Partial<UserDetails>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(details)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUserDetails(prev => prev ? { ...prev, ...details } : null);
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  };

  const value = {
    user,
    userDetails,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserDetails,
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
