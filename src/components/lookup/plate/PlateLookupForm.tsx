
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES } from '@/utils/constants';

interface PlateLookupFormProps {
  plate: string;
  state: string;
  isLoading: boolean;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PlateLookupForm = ({
  plate,
  state,
  isLoading,
  onPlateChange,
  onStateChange,
  onSubmit
}: PlateLookupFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="plate" className="text-sm font-medium">
          License Plate
        </label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => onPlateChange(e.target.value.toUpperCase())}
          placeholder="e.g. ABC123"
          maxLength={8}
          className="uppercase"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium">
          State
        </label>
        <Select value={state} onValueChange={onStateChange} required>
          <SelectTrigger id="state">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label} ({state.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !plate || !state}>
        {isLoading ? 'Looking up...' : 'Lookup Plate'}
      </Button>
    </form>
  );
};
