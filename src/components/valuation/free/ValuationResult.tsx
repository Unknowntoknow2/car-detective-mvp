
import React, { useEffect } from 'react';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { UnifiedValuationHeader } from '@/components/valuation/header/UnifiedValuationHeader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { ManualVehicleInfo } from '@/hooks/useManualValuation';

interface ValuationResultProps {
  valuationData: ManualVehicleInfo | null;
  valuationId?: string;
}

export function ValuationResult({ valuationData, valuationId }: ValuationResultProps) {
  useEffect(() => {
    console.log('FREE VALUATION RESULT: Component loaded');
    console.log('FREE VALUATION RESULT: Props:', { 
      hasData: !!valuationData, 
      valuationId 
    });
    
    if (valuationData) {
      console.log('FREE VALUATION RESULT: Valuation data:', valuationData);
    }
  }, [valuationData, valuationId]);

  if (!valuationData) {
    console.warn('FREE VALUATION RESULT: No valuation data provided');
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
    console.log('FREE VALUATION RESULT: Using UnifiedValuationResult with valuationId:', valuationId);
    return (
      <UnifiedValuationResult 
        valuationId={valuationId}
        displayMode="simple"
      />
    );
  }

  // Fall back to displaying with our header if no valuationId
  console.log('FREE VALUATION RESULT: Using fallback display without valuationId');
  return (
    <div className="space-y-6">
      <UnifiedValuationHeader
        vehicleInfo={{
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage,
          condition: valuationData.condition
        }}
        estimatedValue={valuationData.valuation || 0}
        confidenceScore={valuationData.confidenceScore || 75}
        displayMode="card"
      />
      
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
        priceRange={[
          Math.round((valuationData.valuation || 0) * 0.95),
          Math.round((valuationData.valuation || 0) * 1.05)
        ]}
        manualValuation={valuationData}
        displayMode="simple"
      />
    </div>
  );
}
