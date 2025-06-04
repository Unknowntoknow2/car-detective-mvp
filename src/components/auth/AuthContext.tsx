// ✅ File: src/components/auth/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  userDetails?: UserProfile | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);

  let navigate: NavigateFunction | undefined;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("Router context not available. Navigation will be limited.");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserDetails(session.user.id);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserDetails(session.user.id);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, full_name, avatar_url, dealership_name, premium_expires_at")
      .eq("id", userId)
      .single();

    if (data) {
      setUserDetails(data as UserProfile);
    } else {
      console.error("Error fetching user details:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (navigate) navigate("/dashboard");
      toast.success("Successfully signed in!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Sign up successful! Please check your email for confirmation.");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      if (navigate) navigate("/");
      toast.success("Successfully signed out!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        error,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
