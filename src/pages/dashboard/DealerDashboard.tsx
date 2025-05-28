
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { DealerStats } from '@/components/dealer/DealerStats';
import { DealerValuationsList } from '@/components/dealer/DealerValuationsList';
import { DealerOffersTracker } from '@/components/dealer/DealerOffersTracker';
import { Button } from '@/components/ui/button';

const DealerDashboard = () => {
  const { user, userDetails } = useAuth();
  
  // Redirect if not a dealer
  if (userDetails?.role !== 'dealer') {
    return <Navigate to="/dashboard" replace />;
  }

  const dealerName = userDetails?.dealership_name || 
                    user?.user_metadata?.dealership_name || 
                    userDetails?.full_name || 
                    'Dealer';

  return (
    <div className="container mx-auto py-8 px-4">
      <DealerHeader dealerName={dealerName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <DealerStats />
        </div>
        <div>
          <div className="bg-card rounded-lg shadow p-6 border h-full">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Button className="w-full">Add Vehicle</Button>
              <Button variant="outline" className="w-full">View Offers</Button>
              <Button variant="outline" className="w-full">Manage Leads</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DealerValuationsList />
        </div>
        <div>
          <DealerOffersTracker />
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
