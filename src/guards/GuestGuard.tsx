
import React from 'react';
import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  // This is a simplified implementation
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = localStorage.getItem('auth_token') !== null;
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export default GuestGuard;
