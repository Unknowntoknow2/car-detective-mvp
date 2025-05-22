
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { DEBUG_MODE } from '@/lib/constants';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, userDetails, isLoading } = useAuth();

  // In debug mode, bypass role check
  if (DEBUG_MODE) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to access denied
  if (!userDetails?.role || !allowedRoles.includes(userDetails.role as UserRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  // If user has the required role, render the protected route
  return <>{children}</>;
};

export default RoleGuard;
