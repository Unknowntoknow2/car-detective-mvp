import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateVin } from '@/utils/validation/vin-validation';
import { Loader2, AlertCircle } from 'lucide-react';
import { useValuation } from '@/hooks/useValuation';
import { toast } from 'sonner';

interface VinLookupProps {
  onSubmit?: (vin: string) => void;
  onResultsReady?: (result: any) => void;
}

const VinLookup: React.FC<VinLookupProps> = ({ onSubmit, onResultsReady }) => {
  const [vin, setVin] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isLoading, decodeVin, valuationData } = useValuation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    
    // Clear validation error when input changes
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate VIN
    const validation = validateVin(vin);
    if (!validation.isValid) {
      setValidationError(validation.message || 'Invalid VIN');
      return;
    }
    
    // If external onSubmit handler is provided, use it
    if (onSubmit) {
      onSubmit(vin);
      return;
    }
    
    // Otherwise, use our hook to decode the VIN
    const result = await decodeVin(vin);
    
    if (result.success && valuationData) {
      if (onResultsReady) {
        onResultsReady(valuationData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <div className="relative">
          <Input
            id="vin"
            placeholder="Enter 17-character VIN"
            value={vin}
            onChange={handleChange}
            className={validationError ? 'border-red-300 pr-10' : ''}
          />
          {validationError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        {validationError && (
          <p className="text-sm text-red-500">{validationError}</p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !vin.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up VIN...
          </>
        ) : (
          'Lookup VIN'
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        VIN lookup provides the most accurate valuation based on your specific vehicle.
      </p>
    </form>
  );
};

export default VinLookup;
