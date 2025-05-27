
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Dashboard from './Dashboard';
import DealerDashboard from './DealerDashboard';

export default function DashboardPage() {
  const { user, userDetails, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { replace: true });
      return;
    }

    if (!isLoading && user && userDetails) {
      if (userDetails.role === 'dealer') {
        navigate('/dealer/dashboard', { replace: true });
        return;
      }
    }
  }, [user, userDetails, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show individual dashboard for non-dealer users
  return <Dashboard />;
}
