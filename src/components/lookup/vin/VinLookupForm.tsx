
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchCheck, AlertCircle } from 'lucide-react';
import { ErrorState } from '@/components/premium/common/ErrorState';

interface VinLookupFormProps {
  vin: string;
  isLoading: boolean;
  onVinChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  autoSubmit?: boolean;
}

export const VinLookupForm = ({
  vin,
  isLoading,
  onVinChange,
  onSubmit,
  autoSubmit = false
}: VinLookupFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // VIN validation regex - doesn't allow I, O, Q letters and must be 17 characters
  const validVinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;

  const validateVin = (value: string): boolean => {
    if (!value) return false;
    return validVinPattern.test(value);
  };

  useEffect(() => {
    if (autoSubmit && validateVin(vin) && !isLoading) {
      // Create a complete synthetic FormEvent that satisfies the React.FormEvent interface
      const nativeEvent = new Event('submit');
      const syntheticEvent = {
        preventDefault: () => {},
        target: document.createElement('form'),
        currentTarget: document.createElement('form'),
        nativeEvent,
        type: 'submit',
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
        isTrusted: true,
        eventPhase: 0,
        timeStamp: Date.now(),
        stopPropagation: () => {}
      };
      
      // Use a proper type assertion with 'as unknown as React.FormEvent'
      onSubmit(syntheticEvent as unknown as React.FormEvent);
    }
  }, [autoSubmit, vin, isLoading, onSubmit]);

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase().replace(/[IOQ]/g, ''); // Remove I, O, Q as they aren't used in VINs
    onVinChange(newVin);
    setTouched(true);
    
    // Set validation error if needed
    if (newVin.length > 0 && newVin.length < 17) {
      setError("VIN must be 17 characters");
    } else if (newVin.length === 17 && !validVinPattern.test(newVin)) {
      setError("Invalid VIN format");
    } else {
      setError(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="vin" className="text-sm font-medium">
          Vehicle Identification Number (VIN)
        </label>
        <Input
          id="vin"
          value={vin}
          onChange={handleVinChange}
          placeholder="Enter your 17-character VIN number"
          maxLength={17}
          className="uppercase font-mono text-lg tracking-wider"
          aria-invalid={error ? "true" : "false"}
          required
        />
        
        {touched && error ? (
          <ErrorState 
            message={error} 
            variant="inline" 
            className="mt-2" 
          />
        ) : (
          <p className="text-xs text-muted-foreground">
            <span className="flex items-start gap-1">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>Your VIN can be found on your vehicle registration, insurance card, or driver's side door jamb</span>
            </span>
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !validateVin(vin)}
      >
        <SearchCheck className="mr-2" />
        {isLoading ? 'Looking Up Vehicle Details...' : 'Get Vehicle Details'}
      </Button>
    </form>
  );
}
