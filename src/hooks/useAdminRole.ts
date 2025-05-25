
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useAdminRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsCheckingRole(false);
        return;
      }

      try {
        setIsCheckingRole(true);
        
        // Use the new security definer function to avoid recursion
        const { data, error } = await supabase
          .rpc('is_current_user_admin');
          
        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, isCheckingRole };
}
