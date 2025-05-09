
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute = ({ children }: AuthRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Save the attempted URL for redirection after login
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [user, isLoading, navigate, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading</h2>
          <p className="text-muted-foreground mt-1">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // This should not be visible as we redirect in the useEffect
  return null;
};

export default AuthRoute;
