
import React from 'react';
import { LoadingButton } from '@/components/common/UnifiedLoadingSystem';

interface ValuationFormActionsProps {
  onGetValuation: () => void;
  onGetPremiumValuation: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  showPremiumOption?: boolean;
}

export function ValuationFormActions({
  onGetValuation,
  onGetPremiumValuation,
  isLoading = false,
  isSubmitting = false,
  showPremiumOption = true,
}: ValuationFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <LoadingButton
        onClick={onGetValuation}
        variant="outline"
        isLoading={isLoading && !isSubmitting}
        loadingText="Getting Free Valuation..."
        className="flex-1"
      >
        Get Free Valuation
      </LoadingButton>
      
      {showPremiumOption && (
        <LoadingButton
          onClick={onGetPremiumValuation}
          variant="default"
          isLoading={isSubmitting}
          loadingText="Getting Premium Valuation..."
          className="flex-1"
        >
          Get Premium Valuation
        </LoadingButton>
      )}
    </div>
  );
}
