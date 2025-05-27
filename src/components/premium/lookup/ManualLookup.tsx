
import React from 'react';
import { PremiumManualEntryForm } from '@/components/lookup/manual/PremiumManualEntryForm';
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
  return (
    <PremiumManualEntryForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      initialData={initialData}
      onCancel={onCancel}
    />
  );
}

export default ManualLookup;
