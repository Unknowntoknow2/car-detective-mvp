
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';

interface VINLookupFormProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({ onSubmit, isLoading = false }) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIN format
    const result = validateVIN(vin);
    if (!result.isValid) {
      setError(result.error || 'Invalid VIN format');
      return;
    }
    
    setError(null);
    onSubmit(vin);
  };

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Look up by VIN</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="vin" className="text-sm font-medium">
            Vehicle Identification Number (VIN)
          </label>
          <Input
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            className="font-mono"
            maxLength={17}
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || vin.length !== 17}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up VIN...
            </>
          ) : (
            'Get Vehicle Details'
          )}
        </Button>
      </form>
    </div>
  );
};
