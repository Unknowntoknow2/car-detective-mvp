
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UnifiedPlateLookupProps {
  onVehicleFound?: (data: any) => void;
  showPremiumFeatures?: boolean;
}

export const UnifiedPlateLookup: React.FC<UnifiedPlateLookupProps> = ({
  onVehicleFound,
  showPremiumFeatures = false
}) => {
  const handleLookup = () => {
    if (onVehicleFound) {
      onVehicleFound({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        plate: 'ABC123',
        state: 'CA'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Enter your license plate information to find vehicle details.
        </p>
        <Button onClick={handleLookup}>
          Lookup Vehicle
        </Button>
      </CardContent>
    </Card>
  );
};
