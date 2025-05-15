import React from 'react';
import { VehicleUploadButton } from './VehicleUploadButton';
import { VehicleUploadProvider } from './vehicle-upload/VehicleUploadProvider';

const DealerDashboardContent = () => {
  return (
    <VehicleUploadProvider>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dealer Dashboard</h1>
          <VehicleUploadButton />
        </div>
        
        {/* Other dashboard content would go here */}
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Your dashboard content will appear here.
          </p>
        </div>
      </div>
    </VehicleUploadProvider>
  );
};

export default DealerDashboardContent;
