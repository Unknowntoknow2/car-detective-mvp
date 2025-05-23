
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any | null;
  userDetails: UserDetails | null;
  session: any | null;
  isLoading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserDetails: (details: Partial<UserDetails>) => Promise<void>;
  error?: string | null;
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
              role: data.role || data.user_role,
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
          // Get user profile details
          setTimeout(async () => {
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
                role: data.role || data.user_role,
                email: session.user.email,
                dealership_name: data.dealership_name,
                premium_access: data.premium_access,
                created_at: data.created_at
              });
            }
          }, 0);
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
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive'
        });
        return { success: false, error: error.message };
      }

      toast({
        title: 'Signed in successfully',
        variant: 'success'
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      // Configure the options for signup
      const options = metadata ? { data: metadata } : undefined;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive'
        });
        return { success: false, error: error.message };
      }

      toast({
        title: 'Sign up successful',
        description: 'Welcome to Car Detective!',
        variant: 'success'
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      setUser(null);
      setSession(null);
      setUserDetails(null);
      
      toast({
        title: 'Signed out successfully',
        variant: 'success'
      });
    } catch (error: any) {
      console.error('Unexpected sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const updateUserDetails = async (details: Partial<UserDetails>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(details)
        .eq('id', user.id);
      
      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: 'Profile update failed',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      setUserDetails(prev => prev ? { ...prev, ...details } : null);
      
      toast({
        title: 'Profile updated successfully',
        variant: 'success'
      });
    } catch (error: any) {
      console.error('Unexpected profile update error:', error);
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive'
      });
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
    error
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
