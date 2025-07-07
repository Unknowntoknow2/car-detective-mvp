
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface DealerGuardProps {
  children: React.ReactNode;
}

export const DealerGuard: React.FC<DealerGuardProps> = ({ children }) => {
  const { user, userDetails, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || userDetails?.role !== 'dealer') {
    return <Navigate to="/login-dealer" replace />;
  }

  return <>{children}</>;
};

export default DealerGuard;
