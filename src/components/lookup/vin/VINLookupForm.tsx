
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';

interface VINLookupFormProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  error = null
}) => {
  const [vin, setVin] = useState('');
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateVin = (value: string) => {
    if (!value) {
      setValidationError('VIN is required');
      return false;
    }
    if (value.length !== 17) {
      setValidationError('VIN must be 17 characters');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateVin(vin)) {
      onSubmit(vin);
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    setTouched(true);
    if (touched) {
      validateVin(newVin);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="vin" className="text-sm font-medium block">
          Vehicle Identification Number (VIN)
        </label>
        <Input
          id="vin"
          value={vin}
          onChange={handleVinChange}
          placeholder="Enter 17-character VIN"
          maxLength={17}
          className="uppercase font-mono text-base tracking-wider"
        />
        
        {touched && validationError ? (
          <div className="text-sm text-red-500 flex items-start gap-1">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 flex items-start gap-1">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Your VIN can be found on your vehicle registration or driver's side dashboard
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !vin || vin.length !== 17}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up VIN...
          </>
        ) : (
          'Get Vehicle Details'
        )}
      </Button>
    </form>
  );
};
