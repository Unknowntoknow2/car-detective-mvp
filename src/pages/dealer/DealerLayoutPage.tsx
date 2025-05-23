
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DealerSidebar } from '@/components/dealer/DealerSidebar';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import Loading from '@/components/Loading';

const DealerLayoutPage: React.FC = () => {
  const { user, userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading />;
  }
  
  // Redirect if not logged in or not a dealer
  if (!user || userRole !== 'dealer') {
    return <Navigate to="/auth/dealer" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DealerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DealerHeader />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DealerLayoutPage;
