
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchCheck } from 'lucide-react';

interface VinLookupFormProps {
  vin: string;
  isLoading: boolean;
  onVinChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const VinLookupForm = ({
  vin,
  isLoading,
  onVinChange,
  onSubmit
}: VinLookupFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="vin" className="text-sm font-medium">
          Vehicle Identification Number (VIN)
        </label>
        <Input
          id="vin"
          value={vin}
          onChange={(e) => onVinChange(e.target.value.toUpperCase())}
          placeholder="Enter your 17-character VIN number"
          maxLength={17}
          className="uppercase font-mono text-lg tracking-wider"
          pattern="[A-HJ-NPR-Z0-9]{17}"
          title="Please enter a valid 17-character VIN (no I, O, or Q allowed)"
          required
        />
        <p className="text-xs text-muted-foreground">
          Tip: Your VIN can be found on your vehicle registration, insurance card, or driver's side door jamb
        </p>
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || vin.length !== 17}
      >
        <SearchCheck className="mr-2" />
        {isLoading ? 'Looking Up Vehicle Details...' : 'Get Vehicle Details'}
      </Button>
    </form>
  );
};
