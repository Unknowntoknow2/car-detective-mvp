
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface UserAuthProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'dealer' | 'individual';
}

export const UserAuth: React.FC<UserAuthProps> = ({ children, requiredRole }) => {
  const { user, userDetails, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role is required but user doesn't have it
  if (requiredRole && userDetails?.role !== requiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default UserAuth;
