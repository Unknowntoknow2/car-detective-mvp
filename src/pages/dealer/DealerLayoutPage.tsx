
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DealerSidebar } from '@/components/dealer/DealerSidebar';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import Loading from '@/components/Loading';

const DealerLayoutPage: React.FC = () => {
  const { user, userDetails, isLoading, userRole } = useAuth();
  
  if (isLoading) {
    return <Loading />;
  }
  
  // Redirect if not logged in or not a dealer
  if (!user || userRole !== 'dealer') {
    return <Navigate to="/auth/dealer" replace />;
  }

  // Get the dealer name from userDetails or user metadata
  const dealerName = userDetails?.dealership_name || user?.user_metadata?.dealership_name || userDetails?.full_name || user?.user_metadata?.full_name || 'Dealer';
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DealerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DealerHeader dealerName={dealerName} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DealerLayoutPage;
