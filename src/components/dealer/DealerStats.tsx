
import React from 'react';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';

export function DealerStats() {
  // In a real implementation, this would come from an API or hook
  const stats = {
    activeLeads: 24,
    pendingOffers: 5,
    acceptedOffers: 3,
    averageOffer: 12500
  };

  return (
    <CDCard>
      <CDCardHeader>
        <h2 className="text-lg font-semibold">Dashboard Overview</h2>
      </CDCardHeader>
      <CDCardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Active Leads</p>
            <p className="text-2xl font-bold">{stats.activeLeads}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Pending Offers</p>
            <p className="text-2xl font-bold">{stats.pendingOffers}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Accepted Offers</p>
            <p className="text-2xl font-bold">{stats.acceptedOffers}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Average Offer</p>
            <p className="text-2xl font-bold">${stats.averageOffer.toLocaleString()}</p>
          </div>
        </div>
      </CDCardBody>
    </CDCard>
  );
}
