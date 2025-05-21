
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { LookupTabs } from '@/components/premium/lookup/LookupTabs';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';

interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  lookupVehicle: (type: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string, data?: any) => Promise<any>;
  isLoading: boolean;
  goToNextStep: () => void;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity,
  lookupVehicle,
  isLoading,
  goToNextStep
}: VehicleIdentificationStepProps) {
  const [lookup, setLookup] = useState<'vin' | 'plate' | 'manual'>(
    formData.identifierType === 'manual' ? 'manual' : 
    formData.identifierType === 'plate' ? 'plate' : 'vin'
  );
  
  // Validate step when formData changes
  useEffect(() => {
    const isValid = Boolean(formData.make && formData.model && formData.year);
    updateValidity(step, isValid);
    
    if (isValid) {
      // If we navigate to this step and already have valid data, update step validity
      updateValidity(step, true);
    }
  }, [formData.make, formData.model, formData.year, step, updateValidity]);

  const handleLookupChange = (value: 'vin' | 'plate' | 'manual') => {
    setLookup(value);
  };

  const handleManualSubmit = async (data: ManualEntryFormData) => {
    try {
      console.log("Manual submit with data:", data);
      const result = await lookupVehicle('manual', 'manual-entry', undefined, data);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          make: data.make || result.make,
          model: data.model || result.model,
          year: data.year || result.year,
          mileage: data.mileage,
          zipCode: data.zipCode || '',
          condition: data.condition || '',
          fuelType: data.fuelType || '',
          transmission: data.transmission || '',
          trim: data.trim || result.trim || '',
          bodyType: result.bodyType || '',
          identifierType: 'manual',
          identifier: `${data.year} ${data.make} ${data.model}`
        }));
        
        toast.success(`Added: ${data.year} ${data.make} ${data.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      } else {
        // Even if no result from API, still use the manually entered data
        setFormData(prev => ({
          ...prev,
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          zipCode: data.zipCode || '',
          condition: data.condition || '',
          fuelType: data.fuelType || '',
          transmission: data.transmission || '',
          trim: data.trim || '',
          identifierType: 'manual',
          identifier: `${data.year} ${data.make} ${data.model}`
        }));
        
        toast.success(`Added: ${data.year} ${data.make} ${data.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      }
    } catch (error) {
      console.error('Error submitting manual entry:', error);
      toast.error('Failed to add vehicle details');
    }
  };

  const handleVinLookup = async (vin: string) => {
    try {
      const result = await lookupVehicle('vin', vin);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          vin: vin,
          make: result.make,
          model: result.model,
          year: result.year,
          trim: result.trim || '',
          bodyType: result.bodyType || '',
          fuelType: result.fuelType || '',
          transmission: result.transmission || '',
          identifierType: 'vin',
          identifier: vin
        }));
        
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      }
    } catch (error) {
      console.error('Error looking up VIN:', error);
      toast.error('Failed to look up VIN');
    }
  };

  const handlePlateLookup = async (plate: string, state: string) => {
    try {
      const result = await lookupVehicle('plate', plate, state);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          make: result.make,
          model: result.model,
          year: result.year,
          identifierType: 'plate',
          identifier: `${plate} (${state})`
        }));
        
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      }
    } catch (error) {
      console.error('Error looking up plate:', error);
      toast.error('Failed to look up license plate');
    }
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Identify Your Vehicle</h2>
        <p className="text-muted-foreground mb-6">
          Please provide information about your vehicle using one of the methods below.
        </p>
        
        <LookupTabs 
          lookup={lookup} 
          onLookupChange={handleLookupChange} 
          formProps={{ 
            onSubmit: handleManualSubmit,
            isLoading: isLoading,
            submitButtonText: "Continue",
            onVinLookup: handleVinLookup,
            onPlateLookup: handlePlateLookup
          }} 
        />
      </CardContent>
    </Card>
  );
}
