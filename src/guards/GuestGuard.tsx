
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DEBUG_MODE } from '@/lib/constants';

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { user, userDetails, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // In debug mode, show the page regardless of auth status
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

  // If user is authenticated, redirect to appropriate dashboard
  if (user) {
    if (userDetails?.role === 'dealer') {
      return <Navigate to="/dealer/dashboard" replace />;
    }
    return <Navigate to={from} replace />;
  }

  // If user is not authenticated, render the guest page
  return <>{children}</>;
};

export default GuestGuard;
