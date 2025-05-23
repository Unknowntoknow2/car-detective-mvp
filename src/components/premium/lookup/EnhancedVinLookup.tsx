
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateVin } from '@/utils/validation';
import { Loader2 } from 'lucide-react';

interface EnhancedVinLookupProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
}

export function EnhancedVinLookup({ onSubmit, isLoading = false }: EnhancedVinLookupProps) {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIN
    const validationError = validateVin(vin);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    onSubmit(vin);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="vin" className="block text-sm font-medium">
              Vehicle Identification Number (VIN)
            </label>
            <Input
              id="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              className={error ? 'border-red-500' : ''}
              aria-invalid={!!error}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Looking up...
              </>
            ) : (
              'Lookup VIN'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default EnhancedVinLookup;
