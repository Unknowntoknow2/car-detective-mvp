
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { VinLookup } from "@/components/premium/lookup/VinLookup";

interface VinLookupTabProps {
  vinValue: string;
  isLoading: boolean;
  vehicle: any;
  onVinChange: (value: string) => void;
  onLookup: () => void;
}

export function VinLookupTab({
  vinValue,
  isLoading,
  vehicle,
  onVinChange,
  onLookup
}: VinLookupTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <VinLookup
          value={vinValue}
          onChange={onVinChange}
          onLookup={onLookup}
          isLoading={isLoading}
          existingVehicle={vehicle}
        />
      </CardContent>
    </Card>
  );
}
