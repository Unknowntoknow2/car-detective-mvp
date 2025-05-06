
import { useEffect, useState } from 'react';
import { PredictionResult } from '@/components/valuation/PredictionResult';

interface ValuationResultProps {
  valuationId?: string;
}

export function ValuationResult({ valuationId: propValuationId }: ValuationResultProps) {
  const [hydratedId, setHydratedId] = useState<string | undefined>(propValuationId);

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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Valuation Result</h2>
      <PredictionResult valuationId={hydratedId} />
    </div>
  );
}
