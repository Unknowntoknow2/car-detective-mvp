
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: string;
  mileage: number;
  status: 'available' | 'sold' | 'pending';
}

interface DealerInventoryListProps {
  vehicles?: Vehicle[];
  isLoading?: boolean;
  onAddVehicle?: () => void;
  onEditVehicle?: (id: string) => void;
  onDeleteVehicle?: (id: string) => void;
}

export default function DealerInventoryList({
  vehicles = [],
  isLoading = false,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle
}: DealerInventoryListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p>Loading inventory...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory</CardTitle>
        {onAddVehicle && (
          <Button onClick={onAddVehicle}>Add Vehicle</Button>
        )}
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No vehicles in inventory</p>
            {onAddVehicle && (
              <Button onClick={onAddVehicle} variant="outline">Add Vehicle</Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(vehicle.price)}</TableCell>
                  <TableCell>{vehicle.mileage.toLocaleString()} mi</TableCell>
                  <TableCell className="capitalize">{vehicle.condition}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onEditVehicle && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEditVehicle(vehicle.id)}
                        >
                          Edit
                        </Button>
                      )}
                      {onDeleteVehicle && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onDeleteVehicle(vehicle.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
