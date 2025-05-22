
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp } from 'lucide-react';

interface GetValuationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isPremium?: boolean;
}

export function GetValuationButton({
  onClick,
  disabled = false,
  isLoading = false,
  isPremium = true
}: GetValuationButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isPremium ? "default" : "default"}
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
