
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Car, Calendar, Gauge, Wrench, Fuel, Palette, Users, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DecodedVehicleInfo } from '@/types/vehicle';

interface EnhancedVehicleCardProps {
  vehicle: DecodedVehicleInfo;
  showActions?: boolean;
  onContinue?: () => void;
}

export function EnhancedVehicleCard({ 
  vehicle, 
  showActions = false,
  onContinue 
}: EnhancedVehicleCardProps) {
  const formatMileage = (mileage?: number) => {
    if (!mileage) return 'Unknown';
    return new Intl.NumberFormat().format(mileage) + ' miles';
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-6 w-6" />
          Vehicle Successfully Identified
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Photo */}
          <div className="space-y-3">
            {vehicle.primaryPhoto ? (
              <div className="relative">
                <img 
                  src={vehicle.primaryPhoto} 
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {vehicle.photos?.length || 1} photo{(vehicle.photos?.length || 1) > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Car className="h-12 w-12 mx-auto mb-2" />
                  <p>No photo available</p>
                </div>
              </div>
            )}
            
            {/* Vehicle Title */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              {vehicle.trim && (
                <p className="text-lg text-gray-600 font-medium">{vehicle.trim} Trim</p>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {/* VIN */}
              {vehicle.vin && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">VIN</span>
                    <p className="font-mono text-sm text-gray-800 break-all">{vehicle.vin}</p>
                  </div>
                </div>
              )}

              {/* Mileage */}
              {vehicle.mileage && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Gauge className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Mileage</span>
                    <p className="text-sm text-gray-800">{formatMileage(vehicle.mileage)}</p>
                  </div>
                </div>
              )}
              
              {/* Engine */}
              {vehicle.engine && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Wrench className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Engine</span>
                    <p className="text-sm text-gray-800">{vehicle.engine}</p>
                  </div>
                </div>
              )}
              
              {/* Transmission */}
              {vehicle.transmission && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ArrowUp className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Transmission</span>
                    <p className="text-sm text-gray-800">{vehicle.transmission}</p>
                  </div>
                </div>
              )}
              
              {/* Fuel Type */}
              {vehicle.fuelType && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Fuel className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Fuel Type</span>
                    <p className="text-sm text-gray-800">{vehicle.fuelType}</p>
                  </div>
                </div>
              )}

              {/* Body Type */}
              {vehicle.bodyType && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Car className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Body Type</span>
                    <p className="text-sm text-gray-800">{vehicle.bodyType}</p>
                  </div>
                </div>
              )}

              {/* Exterior Color */}
              {vehicle.exteriorColor && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Palette className="h-4 w-4 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Exterior Color</span>
                    <p className="text-sm text-gray-800">{vehicle.exteriorColor}</p>
                  </div>
                </div>
              )}

              {/* Seating */}
              {vehicle.seats && (
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500">Seating</span>
                    <p className="text-sm text-gray-800">{vehicle.seats} seats</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showActions && onContinue && (
          <div className="pt-4 border-t border-green-200">
            <button
              onClick={onContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Continue to Enhanced Valuation Assessment
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
