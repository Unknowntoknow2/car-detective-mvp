
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { ManualVehicleForm } from '@/components/lookup/ManualVehicleForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ManualValuationPage() {
  const [vehicleData, setVehicleData] = useState<ManualEntryFormData | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVehicleDataSubmit = async (data: ManualEntryFormData) => {
    console.log('✅ Manual vehicle data submitted:', data);
    setIsLoading(true);
    
    try {
      // Save vehicle data to manual_entry_valuations table
      const { data: savedData, error } = await supabase
        .from('manual_entry_valuations')
        .insert({
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          condition: data.condition,
          zip_code: data.zipCode,
          fuel_type: data.fuelType || 'gasoline',
          transmission: data.transmission || 'automatic',
          vin: data.vin || `MANUAL_${Date.now()}`, // Generate unique identifier if no VIN
          accident: data.accidentDetails?.hasAccident || false,
          accident_severity: data.accidentDetails?.severity || null,
          selected_features: data.selectedFeatures || [],
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving vehicle data:', error);
        toast.error('Failed to save vehicle information');
        return;
      }

      console.log('Vehicle data saved:', savedData);
      setVehicleData(data);
      setShowFollowUp(true);
      toast.success('Vehicle information saved successfully!');
    } catch (error) {
      console.error('Error in handleVehicleDataSubmit:', error);
      toast.error('Failed to save vehicle information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSubmit = async (followUpAnswers: FollowUpAnswers) => {
    console.log('✅ Manual follow-up submitted:', followUpAnswers);
    toast.success('Manual valuation completed successfully!');
    // The UnifiedFollowUpForm handles its own saving to follow_up_answers table
  };

  const handleFollowUpSave = async (followUpAnswers: FollowUpAnswers) => {
    console.log('📝 Manual follow-up saved:', followUpAnswers);
    // Progress is automatically saved by the UnifiedFollowUpForm
  };

  // Generate a unique identifier for the follow-up form
  const followUpVin = vehicleData?.vin || `MANUAL_${vehicleData?.make}_${vehicleData?.model}_${vehicleData?.year}`;

  return (
    <Container className="max-w-6xl py-10">
      <CarFinderQaherHeader />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Manual Vehicle Entry
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Enter your vehicle details manually for a comprehensive valuation.
        </p>
      </div>

      <div className="space-y-8">
        {!showFollowUp ? (
          <ManualVehicleForm 
            onSubmit={handleVehicleDataSubmit}
            isLoading={isLoading}
          />
        ) : (
          <>
            {/* Vehicle Summary Card */}
            {vehicleData && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Vehicle Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><strong>Year:</strong> {vehicleData.year}</div>
                  <div><strong>Make:</strong> {vehicleData.make}</div>
                  <div><strong>Model:</strong> {vehicleData.model}</div>
                  <div><strong>Mileage:</strong> {vehicleData.mileage}</div>
                  <div><strong>Condition:</strong> {vehicleData.condition}</div>
                  <div><strong>ZIP Code:</strong> {vehicleData.zipCode}</div>
                  {vehicleData.fuelType && (
                    <div><strong>Fuel Type:</strong> {vehicleData.fuelType}</div>
                  )}
                  {vehicleData.transmission && (
                    <div><strong>Transmission:</strong> {vehicleData.transmission}</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Follow-up Form */}
            <UnifiedFollowUpForm 
              vin={followUpVin}
              initialData={{ 
                vin: followUpVin,
                zip_code: vehicleData?.zipCode || ''
              }}
              onSubmit={handleFollowUpSubmit}
              onSave={handleFollowUpSave}
            />
          </>
        )}
      </div>
    </Container>
  );
}
