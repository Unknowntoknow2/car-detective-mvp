
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface GetValuationButtonProps {
  isLoading: boolean;
  isFormValid: boolean;
  onGetValuation: () => void;
}

export function GetValuationButton({ 
  isLoading, 
  isFormValid, 
  onGetValuation 
}: GetValuationButtonProps) {
  return (
    <div className="text-center py-8">
      <Button
        onClick={onGetValuation}
        size="lg"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculating Valuation...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Get Premium Valuation
          </>
        )}
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        Our AI will analyze your vehicle details and provide an accurate valuation
      </p>
    </div>
  );
}
