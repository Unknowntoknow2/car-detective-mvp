
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DealerDashboardPage from './DealerDashboardPage';
import DealerInventoryPage from './DealerInventoryPage';
import { useAuth } from '@/hooks/useAuth';

const DealerDashboardRoutes = () => {
  const { user, userRole, isLoading } = useAuth();

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
  if (!user || userRole !== 'dealer') {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<DealerDashboardPage />} />
      <Route path="/inventory" element={<DealerInventoryPage />} />
      <Route path="*" element={<Navigate to="/dealer" replace />} />
    </Routes>
  );
};

export default DealerDashboardRoutes;
