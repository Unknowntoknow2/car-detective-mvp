import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleDetailsFormProps {
  step?: number;
  formData?: FormData;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity?: (isValid: boolean) => void;
  initialData?: any;
  onSubmit?: (details: any) => Promise<void>;
  isLoading?: boolean;
}

export function VehicleDetailsForm({ 
  step, 
  formData, 
  setFormData, 
  updateStepValidity,
  initialData,
  onSubmit,
  isLoading
}: VehicleDetailsFormProps) {
  
  // Handle either direct formData or initialData
  const data = formData || initialData || {};
  
  useEffect(() => {
    // Only run if we're in the step validation flow
    if (updateStepValidity) {
      // Validate the form
      const isValid = data.mileage !== undefined && 
                     data.zipCode !== '';
      updateStepValidity(isValid);
    }
  }, [data.mileage, data.zipCode, updateStepValidity]);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (setFormData) {
      // For the form steps flow
      setFormData(prev => ({
        ...prev,
        mileage: value ? parseInt(value) : 0
      }));
    } else if (initialData && onSubmit) {
      // For the direct initialData/onSubmit flow
      initialData.mileage = value ? parseInt(value) : 0;
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (setFormData) {
      // For the form steps flow
      setFormData(prev => ({
        ...prev,
        zipCode: value
      }));
    } else if (initialData && onSubmit) {
      // For the direct initialData/onSubmit flow
      initialData.zipCode = value;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit && initialData) {
      onSubmit(initialData);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
      <p className="text-gray-600 mb-6">
        Please provide additional details about your vehicle.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter vehicle mileage"
            value={data.mileage || ''}
            onChange={handleMileageChange}
          />
        </div>
        
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            placeholder="Enter your ZIP code"
            value={data.zipCode || ''}
            onChange={handleZipCodeChange}
            maxLength={5}
          />
        </div>
        
        {onSubmit && (
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
}
