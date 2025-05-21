
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { DealerInventoryItem } from '@/types/vehicle';

interface DealerInventoryListProps {
  vehicles: DealerInventoryItem[];
  onAddVehicle: () => void;
  onEditVehicle: (id: string) => void;
  onDeleteVehicle: (id: string) => void;
}

const DealerInventoryList: React.FC<DealerInventoryListProps> = ({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500">Sold</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <div>
      {vehicles.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles in Inventory</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first vehicle to your inventory.</p>
          <Button onClick={onAddVehicle}>Add Vehicle</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  {vehicle.make} {vehicle.model} {vehicle.trim}
                </TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell className="capitalize">{vehicle.condition || 'Not specified'}</TableCell>
                <TableCell>{formatCurrency(vehicle.sellingPrice || vehicle.listingPrice || 0)}</TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditVehicle(vehicle.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DealerInventoryList;
