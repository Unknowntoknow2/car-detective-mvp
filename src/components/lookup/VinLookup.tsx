
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VinLookupProps {
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
}

export const VinLookup: React.FC<VinLookupProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [vin, setVin] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim()) return;

    if (onSubmit) {
      onSubmit(vin);
    } else {
      navigate(`/valuation/${vin}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin">Vehicle VIN</Label>
        <Input
          id="vin"
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

export default VinLookup;
