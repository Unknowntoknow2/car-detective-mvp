
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';

interface EnhancedVinLookupProps {
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
}

export function EnhancedVinLookup({ onSubmit, isLoading }: EnhancedVinLookupProps) {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
      return;
    }

    setError(null);
    onSubmit?.(vin);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter VIN (17 characters)"
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                setError(null);
              }}
              maxLength={17}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || vin.length < 17}
            className="w-full"
          >
            {isLoading ? 'Looking up...' : 'Lookup VIN'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
