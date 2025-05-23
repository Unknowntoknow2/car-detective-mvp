
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";
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
        <ManualEntryForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonText="Continue"
          isPremium={true}
        />
      </CardContent>
    </Card>
  );
}
