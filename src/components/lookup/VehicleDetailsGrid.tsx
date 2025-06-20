
import React from 'react';
import { Card } from '@/components/ui/card';
import { DecodedVehicleInfo } from '@/types/vehicle';

interface VehicleDetailsGridProps {
  vehicle: DecodedVehicleInfo;
}

export function VehicleDetailsGrid({ vehicle }: VehicleDetailsGridProps) {
  const details = [
    { label: 'Year', value: vehicle.year },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'VIN', value: vehicle.vin },
    { label: 'Trim', value: vehicle.trim },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Drivetrain', value: vehicle.drivetrain },
    { label: 'Body Type', value: vehicle.bodyType },
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Doors', value: vehicle.doors },
    { label: 'Seats', value: vehicle.seats },
    { label: 'Displacement', value: vehicle.displacement },
    { label: 'Exterior Color', value: vehicle.exteriorColor },
    { label: 'Interior Color', value: vehicle.interiorColor },
  ];

  const nonEmptyDetails = details.filter(detail => detail.value);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nonEmptyDetails.map((detail, index) => (
          <div key={index} className="space-y-1">
            <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
            <dd className="text-sm text-gray-900">{detail.value}</dd>
          </div>
        ))}
      </div>
    </Card>
  );
}
