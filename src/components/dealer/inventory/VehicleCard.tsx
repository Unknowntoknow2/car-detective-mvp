
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Car } from 'lucide-react';
import { DealerVehicle } from '@/types/dealerVehicle';
import { EntityCard } from '@/components/ui/entity-card';
import type { EntityStatus } from '@/components/ui/entity-card';

interface VehicleCardProps {
  vehicle: DealerVehicle;
  onDeleteClick: (vehicle: DealerVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onDeleteClick 
}) => {
  const navigate = useNavigate();

  // Map vehicle status to EntityStatus
  const getStatusVariant = (status: string): EntityStatus => {
    switch (status) {
      case 'available':
        return 'success';
      case 'pending':
        return 'warning';
      case 'sold':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <EntityCard
      id={vehicle.id}
      title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      status={{
        label: vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1),
        variant: getStatusVariant(vehicle.status)
      }}
      image={vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : null}
      imageAlt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      imagePlaceholder={<Car className="h-12 w-12 text-muted-foreground" />}
      price={vehicle.price}
      secondaryInfo={vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'Mileage N/A'}
      detailsPath={`/dealer/vehicles/${vehicle.id}`}
      actions={[
        {
          label: 'Edit',
          icon: <Edit className="h-4 w-4" />,
          onClick: () => navigate(`/dealer/edit/${vehicle.id}`),
          variant: 'outline'
        },
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => onDeleteClick(vehicle),
          variant: 'destructive'
        }
      ]}
    />
  );
};

export default VehicleCard;
