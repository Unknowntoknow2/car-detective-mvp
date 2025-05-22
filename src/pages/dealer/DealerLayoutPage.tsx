
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DealerLayout from '@/layouts/DealerLayout';
import { useAuth } from '@/hooks/useAuth';

const DealerLayoutPage = () => {
  const { user, userDetails, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in or not a dealer, redirect to login
  if (!user || (userDetails && userDetails.role !== 'dealer')) {
    return <Navigate to="/auth/dealer" replace />;
  }

  return (
    <DealerLayout>
      <Outlet />
    </DealerLayout>
  );
};

export default DealerLayoutPage;
