
import React, { useState } from 'react';
import { DealerInventoryList } from '@/components/dealer/inventory/DealerInventoryList';
import { VehicleUploadModal } from '@/components/dealer/vehicle-upload/VehicleUploadModal';

const DealerInventoryListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dealer Inventory</h1>
      
      <DealerInventoryList />
      
      <VehicleUploadModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default DealerInventoryListPage;
