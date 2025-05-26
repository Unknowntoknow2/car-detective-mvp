
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedVinLookup } from '../lookup/vin/EnhancedVinLookup';

interface VehicleLookupFormProps {
  onVehicleFound?: (vehicle: any) => void;
  showHeader?: boolean;
}

export function VehicleLookupForm({ onVehicleFound, showHeader = true }: VehicleLookupFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-center">VIN Lookup</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <EnhancedVinLookup 
          onVehicleFound={onVehicleFound}
          showManualFallback={true}
        />
      </CardContent>
    </Card>
  );
}
