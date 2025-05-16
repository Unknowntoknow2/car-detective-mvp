
import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleDetailsFormProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (isValid: boolean) => void;
}

export function VehicleDetailsForm({ 
  step, 
  formData, 
  setFormData, 
  updateStepValidity 
}: VehicleDetailsFormProps) {
  
  useEffect(() => {
    // Validate the form
    const isValid = formData.mileage !== undefined && 
                   formData.zipCode !== '';
    updateStepValidity(isValid);
  }, [formData.mileage, formData.zipCode, updateStepValidity]);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      mileage: value ? parseInt(value) : undefined
    }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      zipCode: value
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
      <p className="text-gray-600 mb-6">
        Please provide additional details about your vehicle.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter vehicle mileage"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
          />
        </div>
        
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            placeholder="Enter your ZIP code"
            value={formData.zipCode || ''}
            onChange={handleZipCodeChange}
            maxLength={5}
          />
        </div>
      </div>
    </div>
  );
}
