
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  onAddVehicle: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  onAddVehicle
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold tracking-tight">My Inventory</h1>
      <Button onClick={onAddVehicle} className="shrink-0">
        <Plus className="h-4 w-4 mr-2" /> Add New Vehicle
      </Button>
    </div>
  );
};
