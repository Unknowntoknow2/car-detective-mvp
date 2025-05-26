
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DEBUG_MODE } from '@/lib/constants';

interface DealerGuardProps {
  children: React.ReactNode;
}

const DealerGuard: React.FC<DealerGuardProps> = ({ children }) => {
  const { user, userDetails, isLoading } = useAuth();

  // In debug mode, bypass dealer check
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

  // If user is not authenticated, redirect to dealer auth page
  if (!user) {
    return <Navigate to="/auth/dealer" replace />;
  }

  // If user is not a dealer, redirect to access denied or their appropriate dashboard
  if (userDetails?.role !== 'dealer') {
    if (userDetails?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If user is a dealer, render the protected route
  return <>{children}</>;
};

export default DealerGuard;
