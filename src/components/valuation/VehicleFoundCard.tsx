
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface VehicleFoundCardProps {
  vehicle: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
    vin?: string;
    engine?: string;
    transmission?: string;
    bodyType?: string;
  };
}

export const VehicleFoundCard: React.FC<VehicleFoundCardProps> = ({ vehicle }) => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Vehicle Found
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-gray-600">Trim: {vehicle.trim}</p>
          )}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {vehicle.vin && (
              <div>
                <span className="font-medium">VIN:</span>
                <p className="font-mono text-gray-600">{vehicle.vin}</p>
              </div>
            )}
            {vehicle.engine && (
              <div>
                <span className="font-medium">Engine:</span>
                <p className="text-gray-600">{vehicle.engine}</p>
              </div>
            )}
            {vehicle.transmission && (
              <div>
                <span className="font-medium">Transmission:</span>
                <p className="text-gray-600">{vehicle.transmission}</p>
              </div>
            )}
            {vehicle.bodyType && (
              <div>
                <span className="font-medium">Body Type:</span>
                <p className="text-gray-600">{vehicle.bodyType}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
