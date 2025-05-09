
import React from 'react';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="shadow-sm border-2">
      <CardContent className="p-5">
        <ManualEntryForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonText={submitButtonText}
          isPremium={isPremium}
        />
      </CardContent>
    </Card>
  );
}
