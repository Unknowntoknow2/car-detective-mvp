
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { PlateLookupForm } from '@/components/lookup/plate/PlateLookupForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

export default function PlateValuationPage() {
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleVehicleFound = (data: any) => {
    console.log('✅ Plate vehicle data:', data);
    setVehicleData(data);
    setShowFollowUp(true);
  };

  const handleFollowUpComplete = async (followUpAnswers: FollowUpAnswers) => {
    console.log('✅ Plate follow-up completed:', followUpAnswers);
    toast.success('Plate valuation completed successfully!');
    // Handle final valuation here
  };

  return (
    <Container className="max-w-6xl py-10">
      <CarFinderQaherHeader />
      
      {!showFollowUp ? (
        <PlateLookupForm onVehicleFound={handleVehicleFound} />
      ) : (
        <div className="space-y-8">
          {vehicleData && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>Year:</strong> {vehicleData.year}</div>
                <div><strong>Make:</strong> {vehicleData.make}</div>
                <div><strong>Model:</strong> {vehicleData.model}</div>
                <div><strong>Plate:</strong> {vehicleData.plate}</div>
              </div>
            </div>
          )}
          
          <UnifiedFollowUpForm 
            vin={vehicleData?.vin || `PLATE_${vehicleData?.plate || 'LOOKUP'}`}
            onComplete={handleFollowUpComplete}
          />
        </div>
      )}
    </Container>
  );
}
