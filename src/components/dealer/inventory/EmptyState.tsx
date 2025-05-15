
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAddClick?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No vehicles in your inventory",
  description = "Add your first vehicle to get started with inventory management.",
  actionLabel = "Add Vehicle",
  onAddClick,
  icon = <Plus className="h-12 w-12 text-muted-foreground" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-muted/20">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      {onAddClick && (
        <Button onClick={onAddClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
