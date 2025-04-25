
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCcw } from 'lucide-react';

interface ReviewActionsProps {
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
}

export function ReviewActions({ isFormValid, handleSubmit, handleReset }: ReviewActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-2">
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="bg-navy-600 hover:bg-navy-700 text-white flex-1 transition-all duration-300"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Get Premium Valuation
      </Button>
      
      <Button
        onClick={handleReset}
        variant="outline"
        className="text-gray-700 transition-all duration-300"
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Start Over
      </Button>
    </div>
  );
}
