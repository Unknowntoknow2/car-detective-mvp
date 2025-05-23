
import React from 'react';
import { ManualLookup as StandardManualLookup } from '@/components/lookup/ManualLookup';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface PremiumManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

/**
 * Premium version of the ManualLookup component with enhanced features
 */
export function ManualLookup({
  onSubmit,
  isLoading = false,
  submitButtonText = "Continue",
  initialData,
  onCancel
}: PremiumManualLookupProps) {
  // We're reusing the standard ManualLookup but with premium flag set to true
  return (
    <StandardManualLookup
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      isPremium={true}
      initialData={initialData}
      onCancel={onCancel}
    />
  );
}

export default ManualLookup;
