
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermiumAccess, setHasPremiumAccess] = useState(false);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          setHasPremiumAccess(false);
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_premium_dealer')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserRole(profile.role || 'individual');
          setHasPremiumAccess(
            ['premium', 'dealer', 'admin'].includes(profile.role) || 
            profile.is_premium_dealer === true
          );
        } else {
          setUserRole('individual');
          setHasPremiumAccess(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('individual');
        setHasPremiumAccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { 
    userRole, 
    hasPermiumAccess, 
    isLoading,
    isPremium: hasPermiumAccess,
    isDealer: userRole === 'dealer',
    isAdmin: userRole === 'admin'
  };
}
