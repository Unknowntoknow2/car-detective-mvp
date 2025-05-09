
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function VinLookup() {
  const [vin, setVin] = useState('');
  const { lookupVehicle, isLoading, error } = useVehicleLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    try {
      // Lookup VIN using the hook
      await lookupVehicle('vin', vin);
    } catch (err) {
      console.error('Error in VIN lookup:', err);
      toast.error('Failed to process VIN');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            className="font-mono"
            maxLength={17}
          />
          <Button type="submit" disabled={isLoading || vin.length !== 17}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              'Lookup'
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  );
}
