
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  requireRole?: UserRole;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ 
  children, 
  requireRole 
}) => {
  const { user, userDetails, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { state: { from: window.location.pathname } });
    }
    
    if (!isLoading && user && requireRole && userDetails?.role !== requireRole) {
      navigate('/access-denied');
    }
  }, [user, userDetails, isLoading, navigate, requireRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (requireRole && userDetails?.role !== requireRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
