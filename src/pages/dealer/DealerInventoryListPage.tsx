
import React from 'react';
import { Button } from '@/components/ui/button';
import DealerInventoryList from '@/components/dealer/inventory/DealerInventoryList';

const DealerInventoryListPage = () => {
  // Sample vehicle data
  const vehicles = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 24995,
      condition: 'excellent',
      mileage: 25000,
      status: 'available' as const
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      price: 22500,
      condition: 'good',
      mileage: 35000,
      status: 'available' as const
    },
    {
      id: '3',
      make: 'Ford',
      model: 'F-150',
      year: 2018,
      price: 29995,
      condition: 'good',
      mileage: 45000,
      status: 'pending' as const
    }
  ];

  const handleAddVehicle = () => {
    console.log('Adding new vehicle');
  };

  const handleEditVehicle = (id: string) => {
    console.log('Editing vehicle', id);
  };

  const handleDeleteVehicle = (id: string) => {
    console.log('Deleting vehicle', id);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dealer Inventory</h1>
        <Button onClick={handleAddVehicle}>Add Vehicle</Button>
      </div>

      <DealerInventoryList
        vehicles={vehicles}
        onAddVehicle={handleAddVehicle}
        onEditVehicle={handleEditVehicle}
        onDeleteVehicle={handleDeleteVehicle}
      />
    </div>
  );
};

export default DealerInventoryListPage;
