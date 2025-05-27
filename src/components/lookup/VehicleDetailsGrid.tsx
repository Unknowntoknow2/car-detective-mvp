import React from 'react';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface VehicleDetailsGridProps {
  vehicleInfo: DecodedVehicleInfo;
}

export const VehicleDetailsGrid = ({ vehicleInfo }: VehicleDetailsGridProps) => {
  const displayField = (value: string | number | null | undefined) => {
    if (value === undefined || value === null) return "Not Available";
    if (typeof value === 'string' && (
      value.trim() === '' || 
      value === 'N/A' || 
      value === 'Not Applicable' || 
      value === 'Not Available'
    )) {
      return "Not Available";
    }
    return value;
  };

  // Helper to show data availability
  const DataField = ({ label, value, showBadge = false }: { 
    label: string; 
    value: string | number | null | undefined;
    showBadge?: boolean;
  }) => {
    const displayValue = displayField(value);
    const isAvailable = displayValue !== "Not Available";
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {showBadge && (
            <Badge variant={isAvailable ? "secondary" : "outline"} className="text-xs">
              {isAvailable ? "API Data" : "Not in NHTSA"}
            </Badge>
          )}
        </div>
        <p className={`text-lg font-semibold ${!isAvailable ? 'text-muted-foreground' : ''}`}>
          {displayValue}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataField label="Make" value={vehicleInfo.make} />
        <DataField label="Model" value={vehicleInfo.model} />
        <DataField label="Year" value={vehicleInfo.year} />
        <DataField label="Trim" value={vehicleInfo.trim} />
        <DataField label="Engine" value={vehicleInfo.engine} />
        <DataField label="Transmission" value={vehicleInfo.transmission} />
        <DataField label="Drivetrain" value={vehicleInfo.drivetrain} />
        <DataField label="Body Type" value={vehicleInfo.bodyType} />
        <DataField label="Fuel Type" value={vehicleInfo.fuelType} />
        <DataField label="Exterior Color" value={vehicleInfo.exteriorColor || vehicleInfo.color} showBadge={true} />
      </div>
      
      {/* Data source disclaimer */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Real Data Source</p>
            <p className="text-blue-700 mt-1">
              All vehicle specifications come directly from the NHTSA vPIC database. 
              Some details like color may not be available in the government database for all vehicles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
