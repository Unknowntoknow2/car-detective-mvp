
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { FoundCarCard } from '@/components/lookup/found/FoundCarCard';
import { PlateLookupForm } from '@/components/lookup/plate/PlateLookupForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from 'sonner';

export default function PlateValuationPage() {
  const [vehicleData, setVehicleData] = useState<DecodedVehicleInfo | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleVehicleFound = (data: any) => {
    console.log('✅ Plate vehicle data:', data);
    
    // Convert plate lookup data to DecodedVehicleInfo format
    const decodedVehicle: DecodedVehicleInfo = {
      vin: data.vin || `PLATE_${data.plate}_${data.state}`,
      year: data.year,
      make: data.make,
      model: data.model,
      trim: data.trim || '',
      bodyType: data.bodyType || 'Unknown',
      fuelType: data.fuelType || 'Gasoline',
      transmission: data.transmission || 'Automatic',
      engine: data.engine || '',
      drivetrain: data.drivetrain || '',
      exteriorColor: data.exteriorColor || '',
      interiorColor: data.interiorColor || '',
      doors: data.doors || '4',
      seats: data.seats || '5',
      displacement: data.displacement || '',
      mileage: data.mileage || 0,
      condition: data.condition || 'Good',
      plate: data.plate,
      state: data.state
    };
    
    setVehicleData(decodedVehicle);
    setShowFollowUp(true);
  };

  const handleFollowUpSubmit = async (followUpAnswers: FollowUpAnswers) => {
    console.log('✅ Plate follow-up submitted:', followUpAnswers);
    toast.success('Plate valuation completed successfully!');
    // Handle final valuation submission here
  };

  const handleFollowUpSave = async (followUpAnswers: FollowUpAnswers) => {
    console.log('📝 Plate follow-up saved:', followUpAnswers);
    // Progress is automatically saved by the UnifiedFollowUpForm
  };

  return (
    <Container className="max-w-6xl py-10">
      <CarFinderQaherHeader />
      
      {!showFollowUp ? (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              License Plate Lookup
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Enter your license plate to get detailed vehicle information and valuation.
            </p>
          </div>
          <PlateLookupForm onVehicleFound={handleVehicleFound} />
        </div>
      ) : (
        <div className="space-y-8">
          {vehicleData && (
            <FoundCarCard vehicle={vehicleData} />
          )}
          
          <UnifiedFollowUpForm 
            vin={vehicleData?.vin || `PLATE_${vehicleData?.plate || 'LOOKUP'}`}
            initialData={{ 
              vin: vehicleData?.vin || `PLATE_${vehicleData?.plate || 'LOOKUP'}`,
              zip_code: ''
            }}
            onSubmit={handleFollowUpSubmit}
            onSave={handleFollowUpSave}
          />
        </div>
      )}
    </Container>
  );
}
