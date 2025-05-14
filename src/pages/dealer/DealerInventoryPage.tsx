
import React, { useState } from 'react';
import DealerGuard from '@/guards/DealerGuard';
import { DealerInventory } from '@/components/dealer/DealerInventory';
import { AddVehicleModal } from '@/components/dealer/modals';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DealerInventoryList from '@/components/dealer/inventory/DealerInventoryList';

const DealerInventoryPage = () => {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const handleRefresh = () => {
    // This function can be used to trigger any additional refresh logic if needed
    console.log('Refreshing inventory data...');
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Inventory</h1>
        <Button 
          onClick={() => setIsAddVehicleModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Vehicle
        </Button>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="flex p-1 border rounded-md bg-muted/20">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            List View
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <DealerInventory onRefresh={handleRefresh} />
      ) : (
        <DealerInventoryList onRefresh={handleRefresh} />
      )}
      
      <AddVehicleModal
        open={isAddVehicleModalOpen}
        onOpenChange={setIsAddVehicleModalOpen}
        onVehicleAdded={() => setIsAddVehicleModalOpen(false)}
      />
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
