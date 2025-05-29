
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { ManualVehicleForm } from '@/components/lookup/ManualVehicleForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VehicleSpecs {
  make: string;
  model: string;
  trim?: string;
  year: number;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  bodyType: string;
  vin?: string;
}

export default function ManualValuationPage() {
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleSpecs | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVehicleSpecsSubmit = async (specs: VehicleSpecs) => {
    console.log('✅ Manual vehicle specs submitted:', specs);
    setIsLoading(true);
    
    try {
      // Save vehicle specs to manual_entry_valuations table
      const { data, error } = await supabase
        .from('manual_entry_valuations')
        .insert({
          make: specs.make,
          model: specs.model,
          year: specs.year,
          fuel_type: specs.fuelType,
          transmission: specs.transmission,
          vin: specs.vin || `MANUAL_${Date.now()}`, // Generate unique identifier if no VIN
          condition: 'good', // Default condition
          zip_code: '', // Will be filled in follow-up
          mileage: 0, // Will be filled in follow-up
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving vehicle specs:', error);
        toast.error('Failed to save vehicle information');
        return;
      }

      console.log('Vehicle specs saved:', data);
      setVehicleSpecs(specs);
      setShowFollowUp(true);
      toast.success('Vehicle information saved successfully!');
    } catch (error) {
      console.error('Error in handleVehicleSpecsSubmit:', error);
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
  const followUpVin = vehicleSpecs?.vin || `MANUAL_${vehicleSpecs?.make}_${vehicleSpecs?.model}_${vehicleSpecs?.year}`;

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
            onSubmit={handleVehicleSpecsSubmit}
            isLoading={isLoading}
          />
        ) : (
          <>
            {/* Vehicle Summary Card */}
            {vehicleSpecs && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Vehicle Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><strong>Year:</strong> {vehicleSpecs.year}</div>
                  <div><strong>Make:</strong> {vehicleSpecs.make}</div>
                  <div><strong>Model:</strong> {vehicleSpecs.model}</div>
                  <div><strong>Fuel Type:</strong> {vehicleSpecs.fuelType}</div>
                  <div><strong>Transmission:</strong> {vehicleSpecs.transmission}</div>
                  <div><strong>Body Type:</strong> {vehicleSpecs.bodyType}</div>
                  {vehicleSpecs.trim && (
                    <div><strong>Trim:</strong> {vehicleSpecs.trim}</div>
                  )}
                  {vehicleSpecs.vin && (
                    <div><strong>VIN:</strong> {vehicleSpecs.vin}</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Follow-up Form */}
            <UnifiedFollowUpForm 
              vin={followUpVin}
              initialData={{ 
                vin: followUpVin,
                zip_code: ''
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
