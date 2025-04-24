
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES } from '@/utils/constants';
import { toast } from 'sonner';

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
  const [touched, setTouched] = useState({ plate: false, state: false });

  useEffect(() => {
    if (autoSubmit && plate && state && !isLoading) {
      // Create a synthetic FormEvent instead of casting Event
      const syntheticEvent = {
        preventDefault: () => {},
        target: document.createElement('form')
      } as React.FormEvent;
      
      onSubmit(syntheticEvent);
    }
  }, [autoSubmit, plate, state, isLoading, onSubmit]);

  const validatePlate = (value: string) => {
    if (value.length < 2) {
      return "Plate number must be at least 2 characters";
    }
    if (!/^[A-Z0-9]+$/.test(value)) {
      return "Plate can only contain letters and numbers";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const plateError = validatePlate(plate);
    if (plateError) {
      toast.error(plateError);
      return;
    }
    
    if (!state) {
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
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            onPlateChange(value);
          }}
          onBlur={() => setTouched(prev => ({ ...prev, plate: true }))}
          placeholder="e.g. ABC123"
          maxLength={8}
          className="uppercase h-12 text-lg font-medium tracking-wider"
          required
          aria-invalid={touched.plate && validatePlate(plate) ? "true" : "false"}
        />
        {touched.plate && validatePlate(plate) && (
          <p className="text-sm text-destructive mt-1">{validatePlate(plate)}</p>
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
