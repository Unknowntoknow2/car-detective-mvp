
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type RoleType = 'dealer' | 'admin' | 'user' | string;

interface RoleGuardProps {
  allowedRoles: RoleType[];
  children: React.ReactNode;
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  redirectTo = '/auth'
}) => {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    // Redirect to access denied
    return <Navigate to="/access-denied" state={{ requiredRole: allowedRoles.join(', ') }} replace />;
  }
  
  return <>{children}</>;
};

export default RoleGuard;
