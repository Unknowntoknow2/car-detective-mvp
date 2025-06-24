
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Fuel, Settings, Calendar, Gauge } from 'lucide-react';

interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vin?: string;
  plate?: string;
  state?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  drivetrain?: string;
  // Only show these for manual entry
  mileage?: number;
  condition?: string;
  zipCode?: string;
  source?: 'vin' | 'plate' | 'manual';
}

interface CarFinderQaherCardProps {
  vehicle: VehicleInfo;
}

export const CarFinderQaherCard: React.FC<CarFinderQaherCardProps> = ({ vehicle }) => {
  const isManualEntry = vehicle.source === 'manual';
  
  return (
    <Card className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </CardTitle>
              {vehicle.trim && (
                <p className="text-lg text-gray-600 font-medium">{vehicle.trim} Trim</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {vehicle.vin && (
              <Badge variant="outline" className="font-mono text-xs">
                VIN: {vehicle.vin}
              </Badge>
            )}
            {vehicle.plate && vehicle.state && (
              <Badge variant="outline" className="font-mono text-xs">
                {vehicle.state}: {vehicle.plate}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicle.fuelType && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Fuel className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Fuel Type</p>
                <p className="text-sm font-semibold text-gray-800">{vehicle.fuelType}</p>
              </div>
            </div>
          )}
          
          {vehicle.transmission && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Transmission</p>
                <p className="text-sm font-semibold text-gray-800">{vehicle.transmission}</p>
              </div>
            </div>
          )}
          
          {vehicle.bodyType && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Body Style</p>
                <p className="text-sm font-semibold text-gray-800">{vehicle.bodyType}</p>
              </div>
            </div>
          )}

          {/* Only show mileage and condition for manual entry */}
          {isManualEntry && vehicle.mileage && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-green-100 rounded-lg">
                <Gauge className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Mileage</p>
                <p className="text-sm font-semibold text-gray-800">{vehicle.mileage.toLocaleString()} miles</p>
              </div>
            </div>
          )}

          {isManualEntry && vehicle.condition && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Car className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Condition</p>
                <p className="text-sm font-semibold text-gray-800">{vehicle.condition}</p>
              </div>
            </div>
          )}

          {isManualEntry && vehicle.zipCode && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Location</p>
                <p className="text-sm font-semibold text-gray-800">{vehicle.zipCode}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarFinderQaherCard;
