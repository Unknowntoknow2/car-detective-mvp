
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface ValuationEmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ValuationEmptyState: React.FC<ValuationEmptyStateProps> = ({
  message = "No valuation data available. Please try a different search method or vehicle.",
  actionLabel = "Try Again",
  onAction
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/valuation');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 border rounded-lg">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-xl font-medium mb-2">No Results Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message}
      </p>
      <Button onClick={handleAction}>
        {actionLabel}
      </Button>
    </div>
  );
};

export default ValuationEmptyState;
