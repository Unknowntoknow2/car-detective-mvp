import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { DealerInventoryItem } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fixStatusCheck } from '@/components/dealer/inventory';

// Create a stub for DealerInventoryList since it doesn't exist as a default export
const DealerInventoryList = ({ 
  inventory, 
  isLoading, 
  onEdit, 
  onDelete 
}: { 
  inventory: DealerInventoryItem[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="p-6 text-center">Loading inventory...</div>
      ) : inventory.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No vehicles in inventory</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium">Year</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((vehicle) => (
              <tr key={vehicle.id} className="border-t">
                <td className="px-4 py-3">
                  {vehicle.make} {vehicle.model}
                </td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3">${vehicle.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {fixStatusCheck(vehicle.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(vehicle.id)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(vehicle.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default function DealerInventoryListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<DealerInventoryItem[]>([]);

  useEffect(() => {
    async function fetchInventory() {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('dealer_vehicles')
        //   .select('*')
        //   .eq('dealer_id', user?.id);
        
        // For demo, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock inventory data
        const mockInventory: DealerInventoryItem[] = [
          {
            id: "1",
            dealerId: "dealer-123",
            vin: "1HGCM82633A123456",
            make: "Toyota",
            model: "Camry",
            year: 2020,
            listingPrice: 25000,
            price: 25000,
            condition: "Excellent",
            mileage: 15000,
            status: "available"
          },
          {
            id: "2",
            dealerId: "dealer-456",
            vin: "1HGCM82633A123457",
            make: "Honda",
            model: "Accord",
            year: 2021,
            listingPrice: 26000,
            price: 26000,
            condition: "Good",
            mileage: 29000,
            status: "available"
          },
          {
            id: "3",
            dealerId: "dealer-789",
            vin: "1HGCM82633A123458",
            make: "Ford",
            model: "F-150",
            year: 2019,
            listingPrice: 28000,
            price: 28000,
            condition: "Good",
            mileage: 46000,
            status: "available"
          },
          {
            id: "4",
            dealerId: "dealer-012",
            vin: "1HGCM82633A123459",
            make: "Chevrolet",
            model: "Equinox",
            year: 2022,
            listingPrice: 27500,
            price: 27500,
            condition: "Excellent",
            mileage: 19000,
            status: "pending"
          }
        ];
        
        setInventory(mockInventory);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInventory();
  }, [user]);

  const handleAddVehicle = () => {
    navigate('/dealer/vehicles/add');
  };

  const handleEdit = (id: string) => {
    navigate(`/dealer/vehicles/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log('Delete vehicle:', id);
    // In a real app, you would call an API to delete the vehicle
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <Button onClick={handleAddVehicle}>
            <Plus className="mr-2 h-4 w-4" />
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
    </MainLayout>
  );
}
