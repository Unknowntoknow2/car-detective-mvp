
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";

interface ManualEntryTabProps {
  isLoading: boolean;
  onSubmit: (data: any) => void;
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
