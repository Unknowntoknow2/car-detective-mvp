
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateVIN } from '@/utils/validation/vin-validation';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UnifiedVinLookupProps {
  showHeader?: boolean;
  className?: string;
  onSubmit?: (vin: string) => void;
  onVehicleFound?: (vehicle: any) => void;
  initialVin?: string;
}

export function UnifiedVinLookup({ 
  showHeader = false, 
  className,
  onSubmit,
  onVehicleFound,
  initialVin
}: UnifiedVinLookupProps) {
  const { state, setVin, lookupVin } = useVinLookupFlow();
  const [localVin, setLocalVin] = useState(initialVin || '');
  const [error, setError] = useState<string | null>(null);

  // Set initial VIN if provided
  useEffect(() => {
    if (initialVin && initialVin !== localVin) {
      setLocalVin(initialVin);
      setVin(initialVin);
    }
  }, [initialVin, localVin, setVin]);

  // Handle vehicle found
  useEffect(() => {
    if (state.vehicle && onVehicleFound) {
      onVehicleFound(state.vehicle);
    }
  }, [state.vehicle, onVehicleFound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateVIN(localVin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
      return;
    }

    setError(null);
    
    if (onSubmit) {
      onSubmit(localVin);
    } else {
      const result = await lookupVin(localVin);
      if (result && onVehicleFound) {
        onVehicleFound(result);
      }
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setLocalVin(newVin);
    setVin(newVin);
    setError(null);
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-center">Vehicle Lookup</CardTitle>
            <p className="text-center text-muted-foreground">
              Enter your VIN to get started with your vehicle valuation
            </p>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter VIN (17 characters)"
                value={localVin}
                onChange={handleVinChange}
                maxLength={17}
                className={cn(
                  'text-center font-mono text-lg',
                  error && 'border-red-500'
                )}
                disabled={state.isLoading}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1 text-center">{error}</p>
              )}
              {state.error && (
                <p className="text-sm text-red-500 mt-1 text-center">{state.error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={state.isLoading || localVin.length < 17}
              className="w-full"
              size="lg"
            >
              {state.isLoading ? 'Looking up...' : 'Lookup Vehicle'}
            </Button>
          </form>
          
          {state.vehicle && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">Vehicle Found</h3>
              <p className="text-green-700">
                {state.vehicle.year} {state.vehicle.make} {state.vehicle.model}
                {state.vehicle.trim && ` ${state.vehicle.trim}`}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Ready to proceed with valuation
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
