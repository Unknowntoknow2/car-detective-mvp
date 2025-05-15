
import React from 'react';
import { Plus, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
      <div className="h-16 w-16 mb-5 bg-primary/10 rounded-full flex items-center justify-center">
        <Car className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No vehicles in your inventory</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Add your first vehicle listing to your inventory. Vehicles you add will appear here.
      </p>
      <Button onClick={onAddClick} className="flex items-center gap-1 animate-pulse">
        <Plus className="h-4 w-4" />
        Add Your First Vehicle
      </Button>
    </div>
  );
};

export default EmptyState;
