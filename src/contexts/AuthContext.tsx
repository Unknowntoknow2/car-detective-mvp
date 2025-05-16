
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

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
  const isLoading = loading;
  const userRole = userDetails?.role || null;

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, role, full_name, avatar_url')
          .eq('id', user.id)
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
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserDetails(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign-in error' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
    try {
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
      return { success: false, error: error.message || 'Sign-up error' };
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
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserDetails(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
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

// ✅ Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
