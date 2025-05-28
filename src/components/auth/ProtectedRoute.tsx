
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'admin' | 'dealer' | 'individual';
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, userDetails, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { state: { from: location.pathname }, replace: true });
    }
    
    if (!isLoading && user && requireRole && userDetails?.role !== requireRole) {
      navigate('/auth', { replace: true });
    }
  }, [user, userDetails, isLoading, navigate, location, requireRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireRole && userDetails?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
