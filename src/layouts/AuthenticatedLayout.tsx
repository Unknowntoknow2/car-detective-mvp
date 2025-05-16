
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  requireRole?: string;
}

export default function AuthenticatedLayout({ children, requireRole }: AuthenticatedLayoutProps) {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      navigate('/sign-in');
      return;
    }

    // If role is required and user doesn't have it, redirect to access-denied
    if (!isLoading && user && requireRole && userRole !== requireRole) {
      navigate('/access-denied');
      return;
    }
  }, [user, userRole, isLoading, navigate, requireRole]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // If authentication check is not complete or role check fails, don't render children
  if (!user || (requireRole && userRole !== requireRole)) {
    return null;
  }

  return <>{children}</>;
}
