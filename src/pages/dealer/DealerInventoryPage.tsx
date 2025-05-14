
import React, { useState } from 'react';
import DealerGuard from '@/guards/DealerGuard';
import { DealerInventory } from '@/components/dealer/DealerInventory';
import { AddVehicleModal } from '@/components/dealer/modals';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DealerInventoryPage = () => {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  
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
      
      <DealerInventory onRefresh={handleRefresh} />
      
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
