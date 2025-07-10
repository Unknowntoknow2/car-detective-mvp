import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ValuationInsights from './ValuationInsights';

export default function ValuationInsightsPage() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <ValuationInsights />;
}