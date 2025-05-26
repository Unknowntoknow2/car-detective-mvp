
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';

interface VinLookupProps {
  value?: string;
  onChange?: (value: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
  existingVehicle?: any;
}

export function VinLookup({ 
  value = '', 
  onChange, 
  onLookup, 
  isLoading, 
  existingVehicle 
}: VinLookupProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateVIN(value);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
      return;
    }

    setError(null);
    onLookup?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange?.(newValue);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter VIN (17 characters)"
            value={value}
            onChange={handleChange}
            maxLength={17}
            className={error ? 'border-red-500' : ''}
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || value.length < 17}
          className="w-full"
        >
          {isLoading ? 'Looking up...' : 'Lookup VIN'}
        </Button>
      </form>
      
      {existingVehicle && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">Vehicle Found</h3>
          <p className="text-green-700">
            {existingVehicle.year} {existingVehicle.make} {existingVehicle.model}
          </p>
        </div>
      )}
    </div>
  );
}
