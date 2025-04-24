
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
          VIN (17 characters)
        </label>
        <Input
          id="vin"
          value={vin}
          onChange={(e) => onVinChange(e.target.value.toUpperCase())}
          placeholder="e.g. 1HGCM82633A004352"
          maxLength={17}
          className="uppercase"
          pattern="[A-HJ-NPR-Z0-9]{17}"
          title="VIN must be 17 characters and contain only alphanumeric characters (excluding I, O, Q)"
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter a 17-character VIN to decode vehicle information
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || vin.length !== 17}>
        {isLoading ? 'Looking Up...' : 'Lookup VIN'}
      </Button>
    </form>
  );
};
