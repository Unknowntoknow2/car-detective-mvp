
import React from 'react';
import { PremiumBadge } from './PremiumDealerBadge';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { DashboardPanels } from './DashboardPanels';
import { PremiumSubscriptionBanner } from './PremiumSubscriptionBanner';

const DealerDashboardContent = () => {
  const { isPremium, isLoading, expiryDate } = usePremiumDealer();
  
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
          <PremiumBadge />
        </div>
        
        {!isLoading && expiryDate && (
          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            {isPremium 
              ? `Premium subscription active until ${new Date(expiryDate).toLocaleDateString()}`
              : "No active subscription"
            }
          </div>
        )}
      </div>
      
      <PremiumSubscriptionBanner />
      
      <DashboardPanels />
    </div>
  );
};

export default DealerDashboardContent;
