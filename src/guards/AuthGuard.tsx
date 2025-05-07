
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ redirectTo = '/login' }) => {
  // Dummy implementation - should check actual authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

export default AuthGuard;
