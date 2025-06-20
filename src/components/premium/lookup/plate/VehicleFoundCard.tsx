
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';

interface VehicleFoundCardProps {
  vehicle: Vehicle;
  onConfirm?: () => void;
}

export function VehicleFoundCard({ vehicle, onConfirm }: VehicleFoundCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vehicle Found</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Make & Model</p>
            <p className="text-lg font-semibold">{vehicle.make} {vehicle.model}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Year</p>
            <p className="text-lg font-semibold">{vehicle.year}</p>
          </div>
          {vehicle.trim && (
            <div>
              <p className="text-sm font-medium text-gray-600">Trim</p>
              <p className="text-lg font-semibold">{vehicle.trim}</p>
            </div>
          )}
          {vehicle.vin && (
            <div>
              <p className="text-sm font-medium text-gray-600">VIN</p>
              <p className="text-sm font-mono">{vehicle.vin}</p>
            </div>
          )}
        </div>
        
        {vehicle.condition && (
          <div>
            <Badge variant="outline">{vehicle.condition}</Badge>
          </div>
        )}
        
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md transition-colors"
          >
            Continue with this vehicle
          </button>
        )}
      </CardContent>
    </Card>
  );
}
