
import React from 'react';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { ManualVehicleInfo } from '@/hooks/useManualValuation';

interface ValuationResultProps {
  valuationData: ManualVehicleInfo | null;
  valuationId?: string;
}

export function ValuationResult({ valuationData, valuationId }: ValuationResultProps) {
  if (!valuationData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No valuation data is available. Please try submitting the form again.
        </AlertDescription>
      </Alert>
    );
  }

  // If we have a valuationId, use the unified component
  if (valuationId) {
    return (
      <UnifiedValuationResult 
        valuationId={valuationId}
        displayMode="simple"
      />
    );
  }

  // Fall back to the simplified display if no valuationId is provided
  return (
    <UnifiedValuationResult
      estimatedValue={valuationData.valuation || 0}
      confidenceScore={valuationData.confidenceScore || 75}
      vehicleInfo={{
        year: valuationData.year,
        make: valuationData.make,
        model: valuationData.model,
        mileage: valuationData.mileage,
        condition: valuationData.condition
      }}
      // For simplicity, setting a price range based on the valuation
      priceRange={[
        Math.round((valuationData.valuation || 0) * 0.95),
        Math.round((valuationData.valuation || 0) * 1.05)
      ]}
      manualValuation={valuationData}
    />
  );
}
