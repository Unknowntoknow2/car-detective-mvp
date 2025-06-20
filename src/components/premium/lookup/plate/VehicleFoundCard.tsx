
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Car } from 'lucide-react';
import { DecodedVehicleInfo } from '@/types/vehicle';

interface VehicleFoundCardProps {
  vehicle: DecodedVehicleInfo;
  plateValue?: string;
  stateValue?: string;
}

export function VehicleFoundCard({ vehicle, plateValue, stateValue }: VehicleFoundCardProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          Vehicle Found
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Car className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="font-semibold text-lg">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && ` ${vehicle.trim}`}
            </h3>
            <p className="text-sm text-gray-600">
              License Plate: {plateValue} ({stateValue})
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vehicle.vin && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">VIN</p>
              <p className="font-mono text-sm">{vehicle.vin}</p>
            </div>
          )}
          
          {vehicle.bodyType && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Body Type</p>
              <p className="text-sm">{vehicle.bodyType}</p>
            </div>
          )}
          
          {vehicle.fuelType && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Fuel Type</p>
              <p className="text-sm">{vehicle.fuelType}</p>
            </div>
          )}
          
          {vehicle.transmission && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Transmission</p>
              <p className="text-sm">{vehicle.transmission}</p>
            </div>
          )}
        </div>
        
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Ready for Valuation
        </Badge>
      </CardContent>
    </Card>
  );
}
