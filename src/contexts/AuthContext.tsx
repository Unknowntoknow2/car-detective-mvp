
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';
import { User as AppUser, UserDetails } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  userDetails: UserDetails | null;
  userRole?: UserRole;
  error?: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, data?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Set up auth state change listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, currentSession) => {
            setSession(currentSession);
            
            if (currentSession?.user) {
              const userData: AppUser = {
                id: currentSession.user.id,
                email: currentSession.user.email,
                user_metadata: currentSession.user.user_metadata
              };
              
              setUser(userData);
              
              // Get user role from metadata
              const role = currentSession.user.user_metadata?.role || 'individual';
              setUserRole(role as UserRole);
              
              setUserDetails({
                id: currentSession.user.id,
                full_name: currentSession.user.user_metadata?.full_name,
                email: currentSession.user.email,
                role: role as UserRole,
                dealership_name: currentSession.user.user_metadata?.dealership_name,
              });
            } else {
              setUser(null);
              setUserRole(undefined);
              setUserDetails(null);
            }
          }
        );
        
        // THEN check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          const userData: AppUser = {
            id: initialSession.user.id,
            email: initialSession.user.email,
            user_metadata: initialSession.user.user_metadata
          };
          
          setUser(userData);
          setSession(initialSession);
          
          // Get user role from metadata
          const role = initialSession.user.user_metadata?.role || 'individual';
          setUserRole(role as UserRole);
          
          setUserDetails({
            id: initialSession.user.id,
            full_name: initialSession.user.user_metadata?.full_name,
            email: initialSession.user.email,
            role: role as UserRole,
            dealership_name: initialSession.user.user_metadata?.dealership_name,
          });
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);
  
  const signIn = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error);
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error);
      toast({
        title: "Authentication failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message || "An unexpected error occurred" };
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
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Sign up successful!",
        description: "Please check your email to verify your account.",
      });
      
      return { error: null, data };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };
  
  const resetPassword = async (email: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (!error) {
        toast({
          title: "Reset password email sent",
          description: "Please check your email for the reset link",
        });
      } else {
        toast({
          title: "Reset password failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Reset password failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
