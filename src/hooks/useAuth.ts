
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserDetails {
  id: string;
  email?: string;
  role?: string;
  name?: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user and set in state
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Get user profile details from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role, username, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (data) {
            setUserDetails({
              id: data.id,
              email: data.email || user.email,
              role: data.role,
              name: data.username,
              avatar_url: data.avatar_url
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Get user profile details
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, role, username, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        if (!error && data) {
          setUserDetails({
            id: data.id,
            email: data.email || session.user.email,
            role: data.role,
            name: data.username,
            avatar_url: data.avatar_url
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserDetails(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    userDetails,
    loading,
    signOut
  };
}

export default useAuth;
