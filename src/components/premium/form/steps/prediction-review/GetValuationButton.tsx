
import React from 'react';
import { LoadingButton } from '@/components/ui/loading-button';
import { TrendingUp } from 'lucide-react';

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
    <LoadingButton
      onClick={onClick}
      disabled={disabled}
      isLoading={isLoading}
      loadingText="Processing..."
      variant={isPremium ? "default" : "default"}
      className="flex items-center gap-2"
    >
      <TrendingUp className="h-4 w-4" />
      {isPremium ? "Get Premium Valuation" : "Get Free Valuation"}
    </LoadingButton>
  );
}
