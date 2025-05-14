
import React from 'react';
import { DealerVehicleList } from '@/components/dealer/vehicle-upload/DealerVehicleList';
import { VehicleUploadModal } from '@/components/dealer/vehicle-upload/VehicleUploadModal';

const DealerInventoryListPage = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <DealerVehicleList />
      <VehicleUploadModal />
    </div>
  );
};

export default DealerInventoryListPage;
