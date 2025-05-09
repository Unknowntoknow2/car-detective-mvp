
import React from 'react';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';

interface ManualLookupProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export function ManualLookup({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}: ManualLookupProps) {
  return (
    <div>
      <ManualEntryForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText={submitButtonText}
        isPremium={isPremium}
      />
    </div>
  );
}
