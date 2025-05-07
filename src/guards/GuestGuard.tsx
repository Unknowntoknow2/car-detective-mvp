
import React from 'react';
import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth_token') !== null;

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;
