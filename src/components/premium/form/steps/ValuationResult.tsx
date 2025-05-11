
import { useEffect, useState } from 'react';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Valuation ID</AlertTitle>
        <AlertDescription>
          No valuation ID was provided. Please complete the previous steps to generate a valuation.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Valuation Result</h2>
      <UnifiedValuationResult 
        valuationId={hydratedId} 
        displayMode="simple"
      />
    </div>
  );
}
