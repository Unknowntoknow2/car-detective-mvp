
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/unauthorized' 
}) => {
  const location = useLocation();
  const { user, userRole, isLoading } = useAuth();

  // Show loading state or spinner while auth state is being determined
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to unauthorized page
  // Using optional chaining and nullish coalescing to handle undefined userRole
  const currentRole = userRole ?? '';
  
  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is authenticated and has the required role, render children
  return <>{children}</>;
};

export default RoleGuard;
