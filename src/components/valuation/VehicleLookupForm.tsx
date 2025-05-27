
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VinLookupErrorHandler } from '../lookup/VinLookupErrorHandler';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { useNavigate } from 'react-router-dom';
import { UnifiedVinLookup } from '../lookup/UnifiedVinLookup';

interface VehicleLookupFormProps {
  onVehicleFound?: (vehicle: any) => void;
  showHeader?: boolean;
}

export function VehicleLookupForm({ onVehicleFound, showHeader = true }: VehicleLookupFormProps) {
  const { state, setVin, lookupVin, retryLookup } = useVinLookupFlow();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.vehicle && onVehicleFound) {
      onVehicleFound(state.vehicle);
    }
  }, [state.vehicle, onVehicleFound]);

  const handleVehicleFound = (vehicle: any) => {
    if (onVehicleFound) {
      onVehicleFound(vehicle);
    }
  };

  const handleManualEntry = () => {
    const params = state.vin ? `?vin=${state.vin}` : '';
    navigate(`/valuation${params}`);
  };

  const handleRetry = () => {
    retryLookup();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-center">Vehicle Lookup</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <UnifiedVinLookup 
          onVehicleFound={handleVehicleFound}
          showHeader={false}
          externalState={state}
          externalSetVin={setVin}
          externalLookupVin={lookupVin}
        />
        
        {state.stage === 'error' && state.error && (
          <VinLookupErrorHandler
            error={state.error}
            errorType={state.errorType}
            onRetry={handleRetry}
            onManualEntry={handleManualEntry}
            isRetrying={state.isLoading}
          />
        )}

        {state.stage === 'results' && state.vehicle && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Real Vehicle Data Found</h3>
            <p className="text-green-700">
              {state.vehicle.year} {state.vehicle.make} {state.vehicle.model}
              {state.vehicle.trim && ` ${state.vehicle.trim}`}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Data source: Verified VIN database
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
