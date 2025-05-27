
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
  // External state props - if provided, use these instead of internal hook
  externalState?: any;
  externalSetVin?: (vin: string) => void;
  externalLookupVin?: (vin: string) => Promise<any>;
}

export function UnifiedVinLookup({ 
  showHeader = false, 
  className,
  onSubmit,
  onVehicleFound,
  initialVin,
  externalState,
  externalSetVin,
  externalLookupVin
}: UnifiedVinLookupProps) {
  // Use external state if provided, otherwise use internal hook
  const internalHook = useVinLookupFlow();
  const { state, setVin, lookupVin } = externalState ? {
    state: externalState,
    setVin: externalSetVin!,
    lookupVin: externalLookupVin!
  } : internalHook;

  const [localVin, setLocalVin] = useState(initialVin || '');
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 UnifiedVinLookup render:', {
    localVin,
    stateVin: state.vin,
    isLoading: state.isLoading,
    stateStage: state.stage,
    vehicle: state.vehicle,
    usingExternalState: !!externalState,
    hasOnVehicleFoundCallback: !!onVehicleFound
  });

  // Set initial VIN if provided
  useEffect(() => {
    if (initialVin && initialVin !== localVin) {
      console.log('🔄 Setting initial VIN:', initialVin);
      setLocalVin(initialVin);
      setVin(initialVin);
    }
  }, [initialVin, localVin, setVin]);

  // Handle vehicle found - trigger callback when vehicle is found
  useEffect(() => {
    if (state.vehicle && onVehicleFound) {
      console.log('🎯 UnifiedVinLookup: Vehicle found, triggering onVehicleFound callback:', state.vehicle);
      onVehicleFound(state.vehicle);
    }
  }, [state.vehicle, onVehicleFound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 UnifiedVinLookup: Form submitted with VIN:', localVin);
    
    const validation = validateVIN(localVin);
    if (!validation.isValid) {
      const errorMsg = validation.error || 'Invalid VIN format';
      console.log('❌ VIN validation failed:', errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError(null);
    console.log('✅ VIN validation passed, proceeding with lookup');
    
    if (onSubmit) {
      console.log('🔄 Calling onSubmit callback');
      onSubmit(localVin);
    } else {
      console.log('🔄 Calling lookupVin directly');
      try {
        const result = await lookupVin(localVin);
        console.log('🔍 Lookup result in UnifiedVinLookup:', result);
        
        // The useEffect above will handle calling onVehicleFound when state.vehicle updates
      } catch (error) {
        console.error('❌ Lookup error:', error);
        toast.error('VIN lookup failed. Please try again.');
      }
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    console.log('📝 VIN input changed:', newVin);
    setLocalVin(newVin);
    setVin(newVin);
    setError(null);
  };

  const isFormValid = localVin.length === 17;
  const isSubmitDisabled = state.isLoading || !isFormValid;

  console.log('🎯 Button state:', {
    isFormValid,
    isSubmitDisabled,
    localVinLength: localVin.length,
    isLoading: state.isLoading
  });

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
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 mt-2 text-center">
                Debug: VIN length: {localVin.length}, Valid: {isFormValid ? 'Yes' : 'No'}, Loading: {state.isLoading ? 'Yes' : 'No'}
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitDisabled}
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
