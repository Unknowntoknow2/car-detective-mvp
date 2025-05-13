
import { useEffect, useState } from 'react';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { UnifiedValuationHeader } from '@/components/valuation/header/UnifiedValuationHeader';
import { useValuationResult } from '@/hooks/useValuationResult';

interface ValuationResultProps {
  valuationId?: string;
}

export function ValuationResult({ valuationId: propValuationId }: ValuationResultProps) {
  const [hydratedId, setHydratedId] = useState<string | undefined>(propValuationId);
  const { data } = useValuationResult(hydratedId || '');

  useEffect(() => {
    if (!propValuationId) {
      const localId = localStorage.getItem('latest_valuation_id');
      if (localId) {
        console.log("Retrieved valuationId from localStorage:", localId);
        setHydratedId(localId);
      }
    }
  }, [propValuationId]);

  if (!hydratedId) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No valuation result found. Please try submitting your vehicle details again.
      </p>
    );
  }

  // Default vehicle info if data is not available
  const vehicleInfo = data ? {
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    condition: data.condition
  } : {
    make: 'Unknown',
    model: 'Vehicle',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'Good'
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Valuation Result</h2>
      <UnifiedValuationResult 
        valuationId={hydratedId} 
        displayMode="full"
        vehicleInfo={vehicleInfo}
        estimatedValue={data?.estimatedValue || 0}
        confidenceScore={data?.confidenceScore || 85}
        priceRange={data?.priceRange}
        adjustments={data?.adjustments}
      />
    </div>
  );
}
