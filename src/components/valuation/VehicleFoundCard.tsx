
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Car, Calendar, Gauge, Wrench, Fuel } from 'lucide-react';

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
    fuelType?: string;
    drivetrain?: string;
  };
  showActions?: boolean;
  onContinue?: () => void;
}

export const VehicleFoundCard: React.FC<VehicleFoundCardProps> = ({ 
  vehicle, 
  showActions = false,
  onContinue 
}) => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-6 w-6" />
          Vehicle Successfully Identified
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.trim && (
              <p className="text-lg text-gray-600 font-medium">{vehicle.trim} Trim</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {vehicle.vin && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">VIN</span>
                <p className="font-mono text-sm text-gray-800">{vehicle.vin}</p>
              </div>
            </div>
          )}
          
          {vehicle.engine && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Engine</span>
                <p className="text-sm text-gray-800">{vehicle.engine}</p>
              </div>
            </div>
          )}
          
          {vehicle.transmission && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gauge className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Transmission</span>
                <p className="text-sm text-gray-800">{vehicle.transmission}</p>
              </div>
            </div>
          )}
          
          {vehicle.fuelType && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Fuel className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Fuel Type</span>
                <p className="text-sm text-gray-800">{vehicle.fuelType}</p>
              </div>
            </div>
          )}
          
          {vehicle.bodyType && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Car className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Body Type</span>
                <p className="text-sm text-gray-800">{vehicle.bodyType}</p>
              </div>
            </div>
          )}
          
          {vehicle.drivetrain && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Drivetrain</span>
                <p className="text-sm text-gray-800">{vehicle.drivetrain}</p>
              </div>
            </div>
          )}
        </div>

        {showActions && onContinue && (
          <div className="mt-6 pt-4 border-t border-green-200">
            <button
              onClick={onContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Continue to Enhanced Valuation
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleFoundCard;
