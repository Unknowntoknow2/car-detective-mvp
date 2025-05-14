
import React from 'react';
import { Car, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddVehicle: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddVehicle }) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-background mt-6">
      <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Vehicles Listed</h3>
      <p className="text-muted-foreground mb-6">You haven't added any vehicles to your inventory yet.</p>
      <Button onClick={onAddVehicle}>
        <Plus className="h-4 w-4 mr-2" /> Add Your First Vehicle
      </Button>
    </div>
  );
};
