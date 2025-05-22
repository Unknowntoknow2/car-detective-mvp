
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DealerLayout from '@/layouts/DealerLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DealerInventoryList from '@/components/dealer/inventory/DealerInventoryList';
import { DealerInventoryItem } from '@/types/vehicle';
import { toast } from 'sonner';

const DealerInventoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = React.useState<DealerInventoryItem[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      price: 25000,
      mileage: 35000,
      status: 'available',
      photos: [],
      vin: 'ABC123',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Accord',
      year: 2020,
      price: 27500,
      mileage: 28000,
      status: 'pending',
      photos: [],
      vin: 'DEF456',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      make: 'Ford',
      model: 'Mustang',
      year: 2018,
      price: 32000,
      mileage: 40000,
      status: 'sold',
      photos: [],
      vin: 'GHI789',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleEdit = (id: string) => {
    navigate(`/dealer/inventory/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would make an API call
    setInventory(prev => prev.filter(item => item.id !== id));
    toast.success('Vehicle removed from inventory');
  };

  const handleAddVehicle = () => {
    navigate('/dealer/inventory/add');
  };

  return (
    <DealerLayout>
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Manage your vehicle inventory</p>
          </div>
          <Button onClick={handleAddVehicle} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </div>

        <DealerInventoryList 
          inventory={inventory}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DealerLayout>
  );
};

export default DealerInventoryListPage;
