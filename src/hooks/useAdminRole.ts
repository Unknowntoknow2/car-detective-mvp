import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

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
<<<<<<< HEAD
        
        // Use the new security definer function to avoid recursion
        const { data, error } = await supabase
          .rpc('is_current_user_admin');
          
=======

        // Check if the user has an 'admin' role in the user_roles table
        const { data, error } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle() as { data: UserRole | null; error: Error | null };

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, isCheckingRole };
}
