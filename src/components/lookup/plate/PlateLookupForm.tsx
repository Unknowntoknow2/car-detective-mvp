
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export interface PlateLookupFormProps {
  plate: string;
  state: string;
  isLoading: boolean;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PlateLookupForm: React.FC<PlateLookupFormProps> = ({
  plate,
  state,
  isLoading,
  onPlateChange,
  onStateChange,
  onSubmit
}) => {
  const states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    // Add more states as needed
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="plate" className="text-sm font-medium block">
          License Plate
        </label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => onPlateChange(e.target.value.toUpperCase())}
          placeholder="Enter license plate"
          className="uppercase"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium block">
          State
        </label>
        <Select value={state} onValueChange={onStateChange}>
          <SelectTrigger id="state">
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !plate || !state}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up plate...
          </>
        ) : (
          'Get Vehicle Details'
        )}
      </Button>
    </form>
  );
};
