
import React, { useState } from 'react';
import DealerGuard from '@/guards/DealerGuard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PremiumSubscriptionBanner } from '@/components/dealer/PremiumSubscriptionBanner';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';

const DealerInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isPremium, isLoading } = usePremiumDealer();
  
  // Placeholder inventory data
  const inventory = [
    // This would come from your database in a real implementation
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isPremium) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Dealer Inventory</h1>
        <PremiumSubscriptionBanner />
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            Inventory management is available exclusively for premium dealers.
            Upgrade your subscription to access this feature.
          </p>
          <Button variant="premium">Upgrade to Premium</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dealer Inventory</h1>
        <Button className="mt-4 md:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      
      <PremiumSubscriptionBanner />
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No vehicles in inventory</h3>
            <p className="text-gray-500 mb-6">Start adding vehicles to your inventory</p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vehicle cards would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProtectedDealerInventoryPage() {
  return (
    <DealerGuard>
      <DealerInventoryPage />
    </DealerGuard>
  );
}
