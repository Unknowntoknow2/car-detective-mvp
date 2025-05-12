import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { isValidVIN } from '@/utils/validation/vin-validation';

interface VINLookupFormProps {
  onSubmit: (vin: string) => void;
  isLoading: boolean;
  existingVehicle?: {
    make?: string;
    model?: string;
    year?: number;
  };
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({ onSubmit, isLoading, existingVehicle }) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin) {
      setError('VIN is required');
      return;
    }

    if (!isValidVIN(vin)) {
      setError('Invalid VIN format');
      return;
    }

    setError(null);
    onSubmit(vin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="vin"
          type="text"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking Up VIN...
          </>
        ) : (
          'Lookup VIN'
        )}
      </Button>
      {existingVehicle && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            Detected Vehicle: {existingVehicle.year} {existingVehicle.make} {existingVehicle.model}
          </p>
        </div>
      )}
    </form>
  );
};
