
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
  const [roleCheckCompleted, setRoleCheckCompleted] = useState(false);

  // Check user role when user changes
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setRoleCheckCompleted(true);
        return;
      }
      
      try {
        setIsCheckingRole(true);
        console.log('Checking user role for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid error if no data
          
        if (error) {
          console.error('Error fetching user role:', error);
          // Don't block UI progress on error, just log it
          toast.error('Error verifying user profile', { 
            description: 'Please try logging in again' 
          });
        }
        
        console.log('User role data:', data);
        setUserRole(data?.user_role || null);
      } catch (err) {
        console.error('Error checking user role:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsCheckingRole(false);
        setRoleCheckCompleted(true);
        console.log('Role check completed, state updated');
      }
    };
    
    if (user) {
      checkUserRole();
    } else {
      setRoleCheckCompleted(true);
    }
  }, [user]);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (isCheckingRole && !roleCheckCompleted) {
        console.warn('Role check taking too long - applying safety timeout');
        setIsCheckingRole(false);
        setRoleCheckCompleted(true);
      }
    }, 5000); // 5 second safety timeout
    
    return () => clearTimeout(safetyTimeout);
  }, [isCheckingRole, roleCheckCompleted]);

  // Show loading state while authentication is being checked
  if ((loading || isCheckingRole) && !roleCheckCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-2 text-sm text-muted-foreground">Verifying your account...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No authenticated user, redirecting to login');
    // Redirect to login with the location they tried to access
    return <Navigate to="/login-user" state={{ from: location.pathname }} replace />;
  }

  // Redirect dealers to dealer dashboard if they try to access regular dashboard
  if (userRole === 'dealer' && location.pathname === '/dashboard') {
    console.log('Dealer tried to access user dashboard, redirecting to dealer dashboard');
    return <Navigate to="/dealer-dashboard" replace />;
  }

  // Allow access to the protected route
  console.log('Authentication check passed, rendering protected route');
  return <>{children}</>;
};

export default AuthRoute;
