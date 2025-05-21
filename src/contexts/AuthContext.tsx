
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProfile } from '@/types/user';

// Modified to include needed properties
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  userRole?: string | null;
  isLoading: boolean;
  loading?: boolean;
  error: string | null;
  signUp: (email: string, password: string, phone?: string) => Promise<{ error: any; data: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
  sendMagicLink?: (email: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  userDetails?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storedUsername, setStoredUsername] = useLocalStorage('username', '');

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to get session');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        setError(profileError.message || 'Failed to fetch profile');
        return;
      }

      setProfile(profileData || null);
      setUserRole(profileData?.role || 'user');
      if (profileData?.username) {
        setStoredUsername(profileData.username);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return { error, data: null };
      }
      return { error: null, data };
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return { error: err.message || 'Signup failed', data: null };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return { error, data: null };
      }
      return { error: null, data };
    } catch (err: any) {
      setError(err.message || 'Signin failed');
      return { error: err.message || 'Signin failed', data: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (err: any) {
      setError(err.message || 'Signout failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: UserProfile) => {
    setLoading(true);
    try {
      // Fix: Don't include the id in both places to avoid duplicate id error
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...profileData,
          updated_at: new Date(),
        });

      if (error) {
        setError(error.message || 'Failed to update profile');
      } else {
        setProfile(profileData);
        if (profileData.username) {
          setStoredUsername(profileData.username);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    userRole,
    signUp,
    signIn,
    signOut,
    loading,
    isLoading: loading, // Added alias for compatibility
    error,
    updateProfile,
    resetPassword,
    updatePassword,
    userDetails: profile, // Added alias for compatibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
