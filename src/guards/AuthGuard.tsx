<<<<<<< HEAD

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DEBUG_MODE } from '@/lib/constants';
=======
import React from "react";
import { Navigate } from "react-router-dom";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
<<<<<<< HEAD
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // In debug mode, bypass auth check
  if (DEBUG_MODE) {
    return <>{children}</>;
  }

  // Show loading state or spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to unified auth page
  if (!user) {
    // Save the attempted URL for redirection after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected route
=======
  // This is a simplified implementation
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = localStorage.getItem("auth_token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return <>{children}</>;
};

export default AuthGuard;
