
import { useState } from 'react';
import { runCorrectedValuationPipeline } from '@/utils/valuation/correctedValuationPipeline';
import { toast } from 'sonner';

interface CorrectedValuationParams {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  condition: string;
  zipCode: string;
}

// Updated to match the actual return type from the pipeline
interface CorrectedValuationResults {
  success: boolean;
  valuation: {
    estimatedValue: number;
    confidenceScore: number;
    basePrice: number;
    adjustments: any[];
    priceRange: [number, number];
    marketAnalysis?: any;
    riskFactors?: any[];
    recommendations?: string[];
  };
  error?: string;
}

export function useCorrectedValuation() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CorrectedValuationResults | null>(null);

  const runCorrection = async (params: CorrectedValuationParams) => {
    setIsRunning(true);
    try {
      console.log('🔧 Starting corrected valuation pipeline...');
      toast.info('Recalculating valuation with corrected data...');
      
      const results = await runCorrectedValuationPipeline(params);
      
      setResults(results);
      toast.success('Valuation corrected and updated successfully!');
      
      return results;
    } catch (error) {
      console.error('Error running corrected valuation:', error);
      toast.error('Failed to correct valuation');
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    runCorrection,
    isRunning,
    results
  };
}
