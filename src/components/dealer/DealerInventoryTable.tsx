
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDealerInventory } from './hooks/useDealerInventory';
import { DealerVehicle } from '@/types/dealerVehicle'; // Updated import
import { formatCurrency } from '@/utils/formatters';
import { Edit, Trash2, Car } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const DealerInventoryTable: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<DealerVehicle | null>(null);
  
  const { vehicles, isLoading, error, deleteVehicle, refetch } = useDealerInventory();
  
  const handleDeleteClick = (vehicle: DealerVehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    const result = await deleteVehicle(vehicleToDelete.id);
    setIsDeleteDialogOpen(false);
    
    if (result.success) {
      toast.success('Vehicle removed from inventory');
      refetch();
    } else {
      toast.error(result.error || 'Failed to delete vehicle');
    }
    
    setVehicleToDelete(null);
  };
  
  if (isLoading) {
    return <div>Loading inventory...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        Error loading inventory: {error}
      </div>
    );
  }
  
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/20">
        <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Vehicles Found</h3>
        <p className="text-muted-foreground mb-4">
          Your inventory is empty. Add a vehicle to get started.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Mileage</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                {vehicle.make} {vehicle.model}
              </TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'N/A'}
              </TableCell>
              <TableCell>{formatCurrency(vehicle.price)}</TableCell>
              <TableCell>
                <Badge vehicle={vehicle} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Edit vehicle"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Delete vehicle"
                    onClick={() => handleDeleteClick(vehicle)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Delete Dialog would be here */}
    </div>
  );
};

interface BadgeProps {
  vehicle: DealerVehicle;
}

const Badge: React.FC<BadgeProps> = ({ vehicle }) => {
  const getStatusColor = () => {
    switch (vehicle.status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
    </span>
  );
};

export default DealerInventoryTable;
