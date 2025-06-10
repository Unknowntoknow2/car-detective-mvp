
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { VehicleDetailsGrid } from '@/components/lookup/VehicleDetailsGrid';
import { Loader2 } from 'lucide-react';

interface VinDecoderResultsProps {
  data: DecodedVehicleInfo;
  isLoading: boolean;
}

export const VinDecoderResults: React.FC<VinDecoderResultsProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Decoding VIN...</span>
        </CardContent>
      </Card>
    );
  }

  const vehicleTitle = [data.year, data.make, data.model, data.trim]
    .filter(Boolean)
    .join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
        <p className="text-lg font-semibold text-muted-foreground">
          {vehicleTitle}
        </p>
        {data.vin && (
          <p className="text-sm text-muted-foreground font-mono">
            VIN: {data.vin}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <VehicleDetailsGrid vehicleInfo={data} />
      </CardContent>
    </Card>
  );
};

export default VinDecoderResults;
