
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp } from 'lucide-react';

interface GetValuationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isPremium?: boolean;
  isFormValid?: boolean; // Add isFormValid prop
}

export function GetValuationButton({
  onClick,
  disabled = false,
  isLoading = false,
  isPremium = true,
  isFormValid = true // Default to true
}: GetValuationButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || !isFormValid}
      variant={isPremium ? "premium" : "default"}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <TrendingUp className="h-4 w-4" />
          {isPremium ? "Get Premium Valuation" : "Get Free Valuation"}
        </>
      )}
    </Button>
  );
}
