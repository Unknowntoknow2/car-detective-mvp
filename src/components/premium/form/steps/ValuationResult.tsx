
import { PredictionResult } from '@/components/valuation/PredictionResult';

interface ValuationResultProps {
  valuationId: string;
}

export function ValuationResult({ valuationId }: ValuationResultProps) {
  if (!valuationId) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Valuation Result</h2>
      <PredictionResult valuationId={valuationId} />
    </div>
  );
}
