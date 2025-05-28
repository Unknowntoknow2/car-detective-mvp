
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealerVehicle } from '@/types/dealerVehicle';

interface DealerVehicleListProps {
  vehicles: DealerVehicle[];
  onEdit?: (vehicle: DealerVehicle) => void;
  onDelete?: (id: string) => void;
}

export const DealerVehicleList: React.FC<DealerVehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete
}) => {
  if (vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No vehicles in inventory</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
              <span className="text-lg font-bold">
                ${vehicle.price.toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{vehicle.mileage?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-medium">{vehicle.condition || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{vehicle.fuelType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(vehicle)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(vehicle.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DealerVehicleList;
