
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualEntryFormFree } from '@/components/lookup/ManualEntryFormFree';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface ManualEntryFormPremiumProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

/**
 * Premium version of the ManualEntryForm component with enhanced features
 */
export function ManualEntryFormPremium({
  onSubmit,
  isLoading = false,
  submitButtonText = "Continue",
  initialData,
  onCancel
}: ManualEntryFormPremiumProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <ManualEntryFormFree
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonText={submitButtonText}
          isPremium={true}
        />
      </CardContent>
    </Card>
  );
}

export default ManualEntryFormPremium;
