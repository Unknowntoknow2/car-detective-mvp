
import React from 'react';
import { DealerVehicle } from '@/types/dealerVehicle';
import { VehicleCard } from './VehicleCard';

interface VehicleGridProps {
  vehicles: DealerVehicle[];
  onDeleteClick: (vehicle: DealerVehicle) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ 
  vehicles, 
  onDeleteClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default VehicleGrid;
