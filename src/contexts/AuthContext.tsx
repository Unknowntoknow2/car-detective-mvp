
import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Add userDetails to the AuthContextType
interface UserDetails {
  id: string;
  full_name?: string;
  username?: string;
  role?: string;
  avatar_url?: string;
  is_premium?: boolean;
  premium_expires_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: any; // Add error property
  userRole?: string; // Add userRole property
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userDetails: null,
  isLoading: true,
  error: null, // Initialize error property
  userRole: undefined, // Initialize userRole property
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null); // Add error state
  const [userRole, setUserRole] = useState<string | undefined>(undefined); // Add userRole state

  // Fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      // Set userRole based on profile data
      if (data && data.role) {
        setUserRole(data.role);
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // When auth state changes, try to fetch user profile
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase auth
          setTimeout(async () => {
            const profileData = await fetchUserProfile(session.user.id);
            setUserDetails(profileData);
            setIsLoading(false);
          }, 0);
        } else {
          setUserDetails(null);
          setUserRole(undefined);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        setUserDetails(profileData);
        if (profileData?.role) {
          setUserRole(profileData.role);
        }
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null); // Clear any previous errors
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error); // Set error state if login fails
    }
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setError(null); // Clear any previous errors
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) {
      setError(error); // Set error state if signup fails
    }
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    setError(null); // Clear any previous errors
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error); // Set error state if password reset fails
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userDetails,
        isLoading,
        error, // Include error in the context value
        userRole, // Include userRole in the context value
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add the useAuth hook directly in this file
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthProvider;
