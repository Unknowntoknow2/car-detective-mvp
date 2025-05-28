
import React from 'react';
import { Navigate } from 'react-router-dom';
import DealerDashboardPage from './DealerDashboardPage';
import { useAuth } from '@/hooks/useAuth';

const DealerDashboardRoutes = () => {
  const { user, userDetails, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in or not a dealer, redirect to login
  if (!user || userDetails?.role !== 'dealer') {
    return <Navigate to="/auth" replace />;
  }

  // Since this component is rendered within the main router structure,
  // we just return the dashboard content directly
  return (
    <div className="container mx-auto py-8 px-4">
      <DealerDashboardPage />
    </div>
  );
};

export default DealerDashboardRoutes;
