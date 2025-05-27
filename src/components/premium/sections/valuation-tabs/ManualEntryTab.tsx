
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PremiumManualEntryForm } from "@/components/lookup/manual/PremiumManualEntryForm";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

interface ManualEntryTabProps {
  isLoading: boolean;
  onSubmit: (data: ManualEntryFormData) => void;
}

export function ManualEntryTab({
  isLoading,
  onSubmit
}: ManualEntryTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <PremiumManualEntryForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonText="Continue"
        />
      </CardContent>
    </Card>
  );
}
