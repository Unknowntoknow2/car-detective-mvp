
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { StateSelect } from './StateSelect';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, identifier: value }));
    
    // Clean up any previous error
    if (error) setError('');
    
    // For VIN, we can validate length as user types
    if (formData.identifierType === 'vin' && value.length > 0) {
      updateValidity(step, value.length === 17);
    } else if (formData.identifierType === 'plate' && value.length > 0) {
      updateValidity(step, value.length > 0 && state.length > 0);
    } else {
      updateValidity(step, false);
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === 'vin' || value === 'plate') {
      setFormData(prev => ({ ...prev, identifierType: value }));
      // Reset validity when changing identifier type
      updateValidity(step, false);
    }
  };

  const handleStateChange = (value: string) => {
    setState(value);
    // Update validity for plate lookup
    if (formData.identifierType === 'plate') {
      updateValidity(step, formData.identifier.length > 0 && value.length > 0);
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
      await lookupVehicle(formData.identifierType, formData.identifier, state);
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
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className={`sm:col-span-${formData.identifierType === 'plate' ? '3' : '6'}`}>
            <Label htmlFor="identifier">
              {formData.identifierType === 'vin' ? 'VIN' : 'License Plate'}
            </Label>
            <Input
              id="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleInputChange}
              placeholder={formData.identifierType === 'vin' ? 'Enter 17-character VIN' : 'Enter license plate'}
              className="mt-1"
              autoComplete="off"
            />
          </div>
          
          {formData.identifierType === 'plate' && (
            <div className="sm:col-span-3">
              <Label htmlFor="state">State</Label>
              <StateSelect value={state} onChange={handleStateChange} />
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-sm font-medium text-red-600 mt-1">
            {error}
          </div>
        )}
        
        <Button
          type="button"
          onClick={handleFindVehicle}
          disabled={isLoading || 
            (formData.identifierType === 'vin' && formData.identifier.length !== 17) ||
            (formData.identifierType === 'plate' && (!formData.identifier || !state))
          }
          className="w-full sm:w-auto bg-navy-600 hover:bg-navy-700 text-white mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Looking Up...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> 
              Find Vehicle
            </>
          )}
        </Button>
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
