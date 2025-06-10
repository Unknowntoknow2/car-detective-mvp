
import React from "react";
import { ManualLookup as StandardManualLookup } from "@/components/lookup/ManualLookup";
import { ManualEntryFormData } from "@/types/manualEntry";

interface PremiumManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

export function ManualLookup({
  onSubmit,
  isLoading = false,
  submitButtonText = "Continue",
  initialData,
  onCancel,
}: PremiumManualLookupProps) {
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
