
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface GuestGuardProps {
  redirectTo?: string;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ redirectTo = '/' }) => {
  // Dummy implementation - should check actual authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

export default GuestGuard;
