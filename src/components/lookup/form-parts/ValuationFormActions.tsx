
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ValuationFormActionsProps {
  isLoading: boolean;
  submitButtonText: string;
  onSubmit: () => void;
}

export const ValuationFormActions: React.FC<ValuationFormActionsProps> = ({
  isLoading,
  submitButtonText,
  onSubmit
}) => {
  return (
    <Button 
      onClick={onSubmit} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        submitButtonText
      )}
    </Button>
  );
};
