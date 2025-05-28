
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedVinLookup } from './EnhancedVinLookup';

interface VINLookupFormProps {
  onVehicleFound?: (vehicle: any) => void;
  showHeader?: boolean;
}

export function VINLookupForm({ onVehicleFound, showHeader = true }: VINLookupFormProps) {
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
