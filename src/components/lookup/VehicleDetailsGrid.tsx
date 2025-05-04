
import React from 'react';
import type { DecodedVehicleInfo } from '@/types/vehicle';

interface VehicleDetailsGridProps {
  vehicleInfo: DecodedVehicleInfo;
}

export const VehicleDetailsGrid = ({ vehicleInfo }: VehicleDetailsGridProps) => {
  const displayField = (value: string | number | null | undefined) => {
    if (value === undefined || value === null) return "Unknown";
    if (typeof value === 'string' && (
      value.trim() === '' || 
      value === 'N/A' || 
      value === 'Not Applicable' || 
      value === 'Not Available'
    )) {
      return "Unknown";
    }
    return value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Make</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.make)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Model</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.model)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Year</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.year)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Trim</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.trim)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Engine</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.engine)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Transmission</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.transmission)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Drivetrain</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.drivetrain)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Body Type</p>
        <p className="text-lg font-semibold">{displayField(vehicleInfo.bodyType)}</p>
      </div>
    </div>
  );
};

