
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// 👤 User context shape
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

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  userRole: string | null;
  loading: boolean;
  isLoading: boolean;
  session: Session | null; // Add session property
  error: string | null; // Add error property
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
}

// 🌐 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ AuthProvider wrapper
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // Add session state
  const [error, setError] = useState<string | null>(null); // Add error state
  const isLoading = loading;
  const userRole = userDetails?.role || null;

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role, full_name, avatar_url')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setUserDetails({
              id: data.id,
              email: data.email,
              role: data.role,
              name: data.full_name,
              avatar_url: data.avatar_url,
            });
          }
        }
      } catch (err: any) {
        console.error('Error getting user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        const { data } = await supabase
          .from('profiles')
          .select('id, email, role, full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setUserDetails({
            id: data.id,
            email: data.email,
            role: data.role,
            name: data.full_name,
            avatar_url: data.avatar_url,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserDetails(null);
        setSession(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Sign-in error');
      return { success: false, error: error.message || 'Sign-in error' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          role: 'individual',
          email,
          full_name: fullName,
        });
      }

      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Sign-up error');
      return { success: false, error: error.message || 'Sign-up error' };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
    setUserDetails(null);
    setSession(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      userDetails,
      userRole,
      loading,
      isLoading,
      session,
      error,
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

// ✅ Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
