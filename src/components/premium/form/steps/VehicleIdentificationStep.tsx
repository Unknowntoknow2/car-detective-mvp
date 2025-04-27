
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { EnhancedVinLookup } from '@/components/premium/lookup/EnhancedVinLookup';
import { EnhancedPlateLookup } from '@/components/premium/lookup/EnhancedPlateLookup';
import { toast } from 'sonner';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  lookupVehicle: (identifierType: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string, manualData?: any, imageData?: any) => Promise<any>;
  isLoading: boolean;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity,
  lookupVehicle,
  isLoading
}: VehicleIdentificationStepProps) {
  const [state, setState] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, identifier: value }));
    
    // Clean up any previous error
    if (error) setError('');
    
    // For VIN, we can validate length as user types
    if (formData.identifierType === 'vin') {
      updateValidity(step, value.length === 17);
    } else if (formData.identifierType === 'plate') {
      updateValidity(step, value.length >= 2 && value.length <= 8 && state.length > 0);
    } else {
      updateValidity(step, false);
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === 'vin' || value === 'plate') {
      setFormData(prev => ({ 
        ...prev, 
        identifierType: value as 'vin' | 'plate',
        identifier: '' // Clear identifier when changing type
      }));
      // Reset validity when changing identifier type
      updateValidity(step, false);
      // Reset any errors
      setError('');
    }
  };

  const handleStateChange = (value: string) => {
    setState(value);
    // Update validity for plate lookup
    if (formData.identifierType === 'plate') {
      updateValidity(step, formData.identifier.length >= 2 && formData.identifier.length <= 8 && value.length > 0);
    }
  };

  const handleFindVehicle = async () => {
    if (formData.identifierType === 'vin') {
      if (formData.identifier.length !== 17) {
        setError('VIN must be 17 characters long');
        return;
      }
    } else if (formData.identifierType === 'plate' && !state) {
      setError('Please select a state for plate lookup');
      return;
    }
    
    try {
      setError('');
      const result = await lookupVehicle(formData.identifierType, formData.identifier, state);
      
      if (!result) {
        setError(formData.identifierType === 'vin' 
          ? 'Vehicle not found with this VIN. Please check and try again.' 
          : 'Vehicle not found with this plate. Please check and try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Identification</h2>
        <p className="text-gray-600 mb-6">
          Enter your vehicle's VIN or license plate to quickly look up your vehicle information.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="identifierType">Lookup Method</Label>
          <Select 
            value={formData.identifierType} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select lookup method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vin">Vehicle Identification Number (VIN)</SelectItem>
              <SelectItem value="plate">License Plate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          {formData.identifierType === 'vin' ? (
            <EnhancedVinLookup
              value={formData.identifier}
              onChange={handleInputChange}
              onLookup={handleFindVehicle}
              isLoading={isLoading}
              error={error}
            />
          ) : formData.identifierType === 'plate' ? (
            <EnhancedPlateLookup
              plateValue={formData.identifier}
              stateValue={state}
              onPlateChange={handleInputChange}
              onStateChange={handleStateChange}
              onLookup={handleFindVehicle}
              isLoading={isLoading}
              error={error}
            />
          ) : null}
        </div>
      </div>
      
      {formData.make && formData.model && formData.year > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-6">
          <h3 className="text-sm font-medium text-green-800">Vehicle Found</h3>
          <p className="mt-1 text-sm text-green-700">
            {formData.year} {formData.make} {formData.model}
            {formData.mileage && ` • ${formData.mileage.toLocaleString()} miles`}
            {formData.fuelType && ` • ${formData.fuelType}`}
          </p>
        </div>
      )}
    </div>
  );
}
