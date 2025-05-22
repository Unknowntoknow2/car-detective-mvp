
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ValuationEmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ValuationEmptyState: React.FC<ValuationEmptyStateProps> = ({
  message,
  actionLabel = "Try Again",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">Valuation Error</h3>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      
      {onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
