
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { isValidVIN } from '@/utils/validation/vin-validation-helpers';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';

interface VINLookupFormProps {
  value?: string;
  onChange?: (vin: string) => void;
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({ 
  value = "",
  onChange,
  onSubmit, 
  isLoading = false,
  error = null
}) => {
  const [vin, setVin] = useState(value);
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    console.log('VIN FORM: Component mounted with initial value:', value);
  }, [value]);

  const validateVin = (value: string) => {
    console.log('VIN FORM: Validating VIN:', value);
    if (!value) {
      console.log('VIN FORM: Validation failed - VIN is empty');
      setValidationError('VIN is required');
      return false;
    }
    
    if (!isValidVIN(value)) {
      console.log('VIN FORM: Validation failed - Invalid VIN format');
      setValidationError('VIN must be 17 characters, alphanumeric, and cannot contain I, O, or Q');
      return false;
    }
    
    console.log('VIN FORM: Validation passed');
    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('VIN FORM: Form submitted with VIN:', vin);
    if (validateVin(vin)) {
      console.log('VIN FORM: VIN is valid, calling onSubmit');
      onSubmit(vin);
    } else {
      console.log('VIN FORM: VIN is invalid, submission prevented');
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    console.log('VIN FORM: VIN input changed:', newVin);
    setVin(newVin);
    if (onChange) {
      onChange(newVin);
    }
    setTouched(true);
    if (touched) {
      validateVin(newVin);
    }
  };

  const isValid = vin.length === 17 && !validationError;

  useEffect(() => {
    if (error) {
      console.error('VIN FORM: External error received:', error);
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="vin" className="text-sm font-medium block">
          Vehicle Identification Number (VIN)
        </label>
        <div className="relative">
          <Input
            id="vin"
            value={vin}
            onChange={handleVinChange}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className={`uppercase font-mono text-base tracking-wider ${
              touched && validationError ? 'border-red-500 focus-visible:ring-red-500' : 
              (isValid && !isLoading) ? 'border-green-500 focus-visible:ring-green-500' : ''
            }`}
          />
          {isValid && !isLoading && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
        
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
          <VinInfoMessage />
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !isValid}
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
