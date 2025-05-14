
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items found",
  message = "Start by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = <Plus className="h-12 w-12 text-muted-foreground mb-2" />,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-muted/30 ${className}`}>
      {icon}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
