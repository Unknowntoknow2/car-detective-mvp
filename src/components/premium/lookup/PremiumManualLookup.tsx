
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualLookup } from '@/components/premium/lookup/ManualLookup';
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
        <CardTitle>Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <ManualLookup
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Get Premium Valuation"
        />
      </CardContent>
    </Card>
  );
}

export default PremiumManualLookup;
