
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { UserRole } from '@/types/auth';
import { User, UserDetails } from '@/types/user';

interface AuthContextType {
  user: User | null;
  session: any;
  userDetails: UserDetails | null;
  userRole?: UserRole;
  error?: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, data?: any }>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
        } else {
          setSession(session);
          // Use setState function form to avoid type errors
          setUser(prevUser => session?.user ?? null);
          
          if (session?.user) {
            // Get user role from metadata
            const role = session.user.user_metadata?.role || 'individual';
            setUserRole(role as UserRole);
            
            setUserDetails({
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name,
              email: session.user.email,
              role: role as UserRole,
              dealership_name: session.user.user_metadata?.dealership_name,
            });
          }
        }
      } catch (error) {
        console.error('Error in auth context:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Use setState function form to avoid type errors
        setUser(prevUser => session?.user ?? null);
        
        if (session?.user) {
          const role = session.user.user_metadata?.role || 'individual';
          setUserRole(role as UserRole);
          setUserDetails({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name,
            email: session.user.email,
            role: role as UserRole,
            dealership_name: session.user.user_metadata?.dealership_name,
          });
        } else {
          setUserRole(undefined);
          setUserDetails(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, metadata?: any): Promise<{ error: any, data?: any }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
        },
      });
      
      if (error) {
        setError(error);
      }
      
      return { error, data };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserDetails(null);
      setUserRole(undefined);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  const resetPassword = async (email: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
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
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
