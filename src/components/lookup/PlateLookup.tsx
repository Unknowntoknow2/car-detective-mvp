import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { states } from '@/data/states';
import { Loader2 } from 'lucide-react';
import { useValuation } from '@/hooks/useValuation';

export interface PlateLookupProps {
  onSubmit?: (plate: string, state: string) => void;
  onResultsReady?: (result: any) => void;
}

export const PlateLookup: React.FC<PlateLookupProps> = ({
  onSubmit,
  onResultsReady
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { isLoading, decodePlate, valuationData } = useValuation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const errors: Record<string, string> = {};
    if (!plate.trim()) {
      errors.plate = 'License plate is required';
    }
    if (!state) {
      errors.state = 'State is required';
    }
    if (!zipCode.match(/^\d{5}$/)) {
      errors.zipCode = 'Enter a valid 5-digit ZIP code';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Clear validation errors
    setValidationErrors({});
    
    // If onSubmit handler provided, use it
    if (onSubmit) {
      onSubmit(plate, state);
      return;
    }
    
    // Otherwise, use our hook to decode the plate
    const result = await decodePlate(plate, state);
    
    if (result.success && valuationData) {
      if (onResultsReady) {
        onResultsReady(valuationData);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plate">License Plate</Label>
          <Input
            id="plate"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="Enter plate number"
            className={validationErrors.plate ? 'border-red-500' : ''}
          />
          {validationErrors.plate && (
            <p className="text-sm text-red-500">{validationErrors.plate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger 
              id="state"
              className={validationErrors.state ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.state && (
            <p className="text-sm text-red-500">{validationErrors.state}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code</Label>
        <Input
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP code"
          className={validationErrors.zipCode ? 'border-red-500' : ''}
        />
        {validationErrors.zipCode && (
          <p className="text-sm text-red-500">{validationErrors.zipCode}</p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up plate...
          </>
        ) : (
          'Lookup License Plate'
        )}
      </Button>
    </form>
  );
};

export default PlateLookup;
