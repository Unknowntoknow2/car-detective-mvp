
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCorrectedValuation } from '@/hooks/useCorrectedValuation';

interface CorrectionTriggerProps {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  onCorrectionComplete?: (results: any) => void;
}

export function CorrectionTrigger({
  vin,
  make,
  model,
  year,
  mileage,
  condition,
  zipCode,
  onCorrectionComplete
}: CorrectionTriggerProps) {
  const { runCorrection, isRunning, results } = useCorrectedValuation();

  const handleCorrection = async () => {
    try {
      const correctionResults = await runCorrection({
        vin,
        make,
        model,
        year,
        mileage,
        condition,
        zipCode
      });
      
      if (onCorrectionComplete) {
        onCorrectionComplete(correctionResults);
      }
    } catch (error) {
    }
  };

  if (results?.success) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Valuation Corrected</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleCorrection}
      disabled={isRunning}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isRunning ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Correcting...
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          Force Correct Valuation
        </>
      )}
    </Button>
  );
}
