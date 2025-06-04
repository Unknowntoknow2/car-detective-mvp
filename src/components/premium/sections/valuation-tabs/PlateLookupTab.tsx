
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedPlateLookup } from '@/components/lookup/plate/UnifiedPlateLookup';

interface PlateLookupTabProps {
  plateValue: string;
  plateState: string;
  isLoading: boolean;
  vehicle: any;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
}

export function PlateLookupTab({
  plateValue,
  plateState,
  isLoading,
  vehicle,
  onPlateChange,
  onStateChange,
  onLookup
}: PlateLookupTabProps) {
  const handleVehicleFound = (data: any) => {
    onPlateChange(data.plate);
    onStateChange(data.state);
    onLookup();
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <UnifiedPlateLookup
          tier="premium"
          onVehicleFound={handleVehicleFound}
          showPremiumFeatures={true}
          includePremiumBadging={false}
        />
        
        {vehicle && (
          <div className="mt-4 p-4 bg-primary/5 rounded-md">
            <p className="font-medium">Found: {vehicle.year} {vehicle.make} {vehicle.model}</p>
            {vehicle.trim && <p className="text-sm text-muted-foreground">Trim: {vehicle.trim}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
