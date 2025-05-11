
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user role when user changes
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        setIsCheckingRole(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user role:', error);
          return;
        }
        
        setUserRole(data?.user_role || null);
      } catch (err) {
        console.error('Error checking user role:', err);
      } finally {
        setIsCheckingRole(false);
      }
    };
    
    if (user) {
      checkUserRole();
    }
  }, [user]);

  // Show loading state while authentication is being checked
  if (loading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Redirect to login with the location they tried to access
    return <Navigate to="/login-user" state={{ from: location.pathname }} replace />;
  }

  // Allow access to the protected route
  return <>{children}</>;
};

export default AuthRoute;
