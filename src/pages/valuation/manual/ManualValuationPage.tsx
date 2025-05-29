import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

export default function ManualValuationPage() {
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleVehicleFound = (data: any) => {
    console.log('✅ Manual vehicle data:', data);
    setVehicleData(data);
    setShowFollowUp(true);
  };

  const handleFollowUpSubmit = async (followUpAnswers: FollowUpAnswers) => {
    console.log('✅ Manual follow-up submitted:', followUpAnswers);
    toast.success('Manual valuation completed successfully!');
    // Handle final valuation here
  };

  const handleFollowUpSave = async (followUpAnswers: FollowUpAnswers) => {
    console.log('📝 Manual follow-up saved:', followUpAnswers);
    // Handle saving progress here
  };

  return (
    <Container className="max-w-6xl py-10">
      <CarFinderQaherHeader />
      
      {!showFollowUp ? (
        <ManualEntryForm onVehicleFound={handleVehicleFound} />
      ) : (
        <div className="space-y-8">
          {vehicleData && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>Year:</strong> {vehicleData.year}</div>
                <div><strong>Make:</strong> {vehicleData.make}</div>
                <div><strong>Model:</strong> {vehicleData.model}</div>
                <div><strong>Mileage:</strong> {vehicleData.mileage?.toLocaleString()}</div>
              </div>
            </div>
          )}
          
          <UnifiedFollowUpForm 
            vin={vehicleData?.vin || 'MANUAL_ENTRY'}
            initialData={{ vin: vehicleData?.vin || 'MANUAL_ENTRY' }}
            onSubmit={handleFollowUpSubmit}
            onSave={handleFollowUpSave}
          />
        </div>
      )}
    </Container>
  );
}
