
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { DealerInventoryList } from '@/components/dealer/inventory/DealerInventoryList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DealerInventoryItem } from '@/types/vehicle';

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
            id: '1',
            make: 'Toyota',
            model: 'Camry',
            year: 2019,
            price: 23500,
            listingPrice: 23500,
            condition: 'Excellent',
            mileage: 32000,
            status: 'available'
          },
          {
            id: '2',
            make: 'Honda',
            model: 'Accord',
            year: 2020,
            price: 25900,
            listingPrice: 25900,
            condition: 'Good',
            mileage: 28000,
            status: 'available'
          },
          {
            id: '3',
            make: 'Ford',
            model: 'F-150',
            year: 2018,
            price: 29800,
            listingPrice: 29800,
            condition: 'Good',
            mileage: 45000,
            status: 'available'
          },
          {
            id: '4',
            make: 'Chevrolet',
            model: 'Equinox',
            year: 2021,
            price: 27500,
            listingPrice: 27500,
            condition: 'Excellent',
            mileage: 18000,
            status: 'pending'
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
          onEdit={(id) => navigate(`/dealer/vehicles/edit/${id}`)}
          onDelete={(id) => console.log('Delete vehicle:', id)}
        />
      </div>
    </MainLayout>
  );
}
