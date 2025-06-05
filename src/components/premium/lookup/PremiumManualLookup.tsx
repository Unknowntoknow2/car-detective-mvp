
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManualLookup } from "@/components/premium/lookup/ManualLookup";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

interface PremiumManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
}

export function PremiumManualLookup({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Premium Valuation",
  initialData,
}: PremiumManualLookupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <ManualLookup
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonText={submitButtonText}
          initialData={initialData}
        />
      </CardContent>
    </Card>
  );
}

export default PremiumManualLookup;
