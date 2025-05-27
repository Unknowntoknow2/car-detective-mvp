
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PremiumManualEntryForm } from '@/components/lookup/manual/PremiumManualEntryForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface PremiumManualLookupProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
}

export function PremiumManualLookup({ onSubmit, isLoading = false }: PremiumManualLookupProps) {
  // Create a default submit handler if none provided
  const handleSubmit = (data: ManualEntryFormData) => {
    console.log('Manual entry submitted:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <PremiumManualEntryForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Get Premium Valuation"
        />
      </CardContent>
    </Card>
  );
}

export default PremiumManualLookup;
