
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VINLookupFormProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [vin, setVin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim()) {
      onSubmit(vin);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin-lookup">Vehicle VIN</Label>
        <Input
          id="vin-lookup"
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter 17-character VIN"
          maxLength={17}
          className="uppercase"
        />
      </div>
      <Button type="submit" disabled={isLoading || !vin.trim()} className="w-full">
        {isLoading ? 'Looking up...' : 'Lookup VIN'}
      </Button>
    </form>
  );
};
