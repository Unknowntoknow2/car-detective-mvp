
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PremiumManualEntryForm } from './PremiumManualEntryForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface ManualEntryFormPremiumProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

/**
 * Premium version wrapper - kept for backward compatibility
 */
export function ManualEntryFormPremium({
  onSubmit,
  isLoading = false,
  submitButtonText = "Continue",
  initialData,
  onCancel
}: ManualEntryFormPremiumProps) {
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

export default ManualEntryFormPremium;
