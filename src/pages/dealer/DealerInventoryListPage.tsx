
import React, { useState } from 'react';
import { DealerInventoryList } from '@/components/dealer/inventory/DealerInventoryList';
import { DealerInventoryItem } from '@/types/vehicle';

export default function DealerInventoryListPage() {
  const [vehicles] = useState<DealerInventoryItem[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25000,
      mileage: 30000,
      vin: '1234567890ABCDEFG',
      status: 'available',
      condition: 'Good',
      photos: [],
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      price: 20000,
      mileage: 45000,
      vin: '1234567890ABCDEFH',
      status: 'available',
      condition: 'Excellent',
      photos: [],
      created_at: '2023-01-02T00:00:00Z'
    },
    {
      id: '3',
      make: 'Ford',
      model: 'F-150',
      year: 2021,
      price: 35000,
      mileage: 15000,
      vin: '1234567890ABCDEFI',
      status: 'sold',
      condition: 'Very Good',
      photos: [],
      created_at: '2023-01-03T00:00:00Z'
    }
  ]);

  const handleEdit = (vehicle: DealerInventoryItem) => {
    console.log('Edit vehicle:', vehicle);
  };

  const handleDelete = (vehicle: DealerInventoryItem) => {
    console.log('Delete vehicle:', vehicle);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dealer Inventory</h1>
      <DealerInventoryList
        vehicles={vehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
