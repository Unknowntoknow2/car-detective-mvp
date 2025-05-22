
import { useEffect, useState } from 'react';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Valuation ID</AlertTitle>
        <AlertDescription>
          No valuation ID was provided. Please complete the previous steps to generate a valuation.
        </AlertDescription>
      </Alert>
    );
  }

  // Default vehicle info if data is not available
  const vehicleInfo = data ? {
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage || 0,
    condition: data.condition || 'Good'
  } : {
    make: 'Unknown',
    model: 'Vehicle',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'Good'
  };

  // Ensure priceRange is a tuple with exactly two elements
  const priceRange: [number, number] = data?.price_range ? 
    (Array.isArray(data.price_range) ? 
      [Number(data.price_range[0]), Number(data.price_range[1])] : 
      'low' in data.price_range && 'high' in data.price_range ?
      [Number(data.price_range.low), Number(data.price_range.high)] :
      [0, 0]) : 
    [0, 0];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Valuation Result</h2>
      <UnifiedValuationResult 
        valuationId={hydratedId} 
        displayMode="full"
        vehicleInfo={vehicleInfo}
        estimatedValue={data?.estimatedValue || 0}
        confidenceScore={data?.confidenceScore || 85}
        priceRange={priceRange}
        adjustments={data?.adjustments || []}
      />
    </div>
  );
}
