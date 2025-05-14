
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DealerInventoryTable } from '@/components/dealer/DealerInventoryTable';
import { Button } from '@/components/ui/button';

const DealerInventoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            View, edit and manage your vehicle listings
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dealer/inventory/add')}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      
      <DealerInventoryTable />
    </div>
  );
};

export default DealerInventoryPage;
