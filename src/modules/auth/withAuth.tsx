
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export type RoleType = 'admin' | 'dealer' | 'user' | undefined;

export const withAuth = (
  Component: React.ComponentType,
  allowedRoles?: RoleType[]
) => {
  return function ProtectedRoute(props: any) {
    const { user, userDetails, isLoading } = useAuth();
    const navigate = useNavigate();
    const userRole = userDetails?.role;

    useEffect(() => {
      if (!isLoading && !user) {
        // User not logged in, redirect to auth page
        navigate('/auth/signin', { replace: true });
      } else if (
        !isLoading && 
        user && 
        allowedRoles && 
        userRole && 
        !allowedRoles.includes(userRole as RoleType)
      ) {
        // User doesn't have required role, redirect based on their role
        if (userRole === 'admin') {
          navigate('/qa', { replace: true });
        } else if (userRole === 'dealer') {
          navigate('/dealer', { replace: true });
        } else {
          navigate('/my-valuations', { replace: true });
        }
      }
    }, [user, userRole, isLoading, navigate]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (!user) {
      return null; // Will be redirected by the effect
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole as RoleType)) {
      return null; // Will be redirected by the effect
    }

    return <Component {...props} />;
  };
};
