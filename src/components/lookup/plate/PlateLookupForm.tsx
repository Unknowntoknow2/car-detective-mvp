
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES } from '@/utils/constants';
import { toast } from 'sonner';
import { ErrorState } from '@/components/premium/common/ErrorState';

interface PlateLookupFormProps {
  plate: string;
  state: string;
  isLoading: boolean;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  autoSubmit?: boolean;
}

export const PlateLookupForm = ({
  plate,
  state,
  isLoading,
  onPlateChange,
  onStateChange,
  onSubmit,
  autoSubmit = false
}: PlateLookupFormProps) => {
  const [plateError, setPlateError] = useState<string | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ plate: false, state: false });

  useEffect(() => {
    if (autoSubmit && plate && state && !isLoading && !plateError && !stateError) {
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
  }, [autoSubmit, plate, state, isLoading, onSubmit, plateError, stateError]);

  const validatePlate = (value: string): string | null => {
    if (!value) return "Plate number is required";
    if (value.length < 2) return "Plate number must be at least 2 characters";
    if (!/^[A-Z0-9]+$/.test(value)) return "Plate can only contain letters and numbers";
    return null;
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onPlateChange(value);
    setTouched(prev => ({ ...prev, plate: true }));
    setPlateError(validatePlate(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const plateValidationError = validatePlate(plate);
    if (plateValidationError) {
      setPlateError(plateValidationError);
      toast.error(plateValidationError);
      return;
    }
    
    if (!state) {
      setStateError("Please select a state");
      toast.error("Please select a state");
      return;
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="plate" className="text-sm font-medium">
          License Plate
        </label>
        <Input
          id="plate"
          value={plate}
          onChange={handlePlateChange}
          placeholder="e.g. ABC123"
          maxLength={8}
          className="uppercase h-12 text-lg font-medium tracking-wider"
          aria-invalid={touched.plate && plateError ? "true" : "false"}
          required
        />
        {touched.plate && plateError && (
          <ErrorState message={plateError} variant="inline" className="mt-2" />
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium">
          State
        </label>
        <Select 
          value={state} 
          onValueChange={(value) => {
            onStateChange(value);
            setTouched(prev => ({ ...prev, state: true }));
            setStateError(null);
          }}
          required
        >
          <SelectTrigger id="state" className="h-12">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((state) => (
              <SelectItem 
                key={state.value} 
                value={state.value}
                className="py-3"
              >
                {state.label} ({state.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.state && stateError && (
          <ErrorState message={stateError} variant="inline" className="mt-2" />
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-lg font-medium"
        disabled={isLoading || !plate || !state}
      >
        {isLoading ? 'Looking up...' : 'Lookup Plate'}
      </Button>
    </form>
  );
};
