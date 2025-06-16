
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VinDecoderFormProps {
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
}

export const VinDecoderForm: React.FC<VinDecoderFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [vin, setVin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim() && onSubmit) {
      onSubmit(vin);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin-decoder">VIN</Label>
        <Input
          id="vin-decoder"
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter VIN to decode"
          maxLength={17}
          className="uppercase"
        />
      </div>
      <Button type="submit" disabled={isLoading || !vin.trim()}>
        {isLoading ? 'Decoding...' : 'Decode VIN'}
      </Button>
    </form>
  );
};

export default VinDecoderForm;
