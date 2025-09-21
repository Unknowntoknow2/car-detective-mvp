import { useState } from 'react';
import { runValuation } from '@/lib/ainClient';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

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

// Updated to match the actual return type from AIN API
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
      toast.info('Recalculating valuation with corrected data...');
      
      const t0 = performance.now();
      const { data: ainResult, meta } = await runValuation({
        vin: params.vin,
        make: params.make,
        model: params.model,
        year: params.year,
        mileage: params.mileage,
        zip_code: params.zipCode,
        condition: params.condition as "poor" | "fair" | "good" | "very_good" | "excellent",
        requested_by: 'corrected_valuation'
      });
      
      logger.log("ain.val.ms", Math.round(performance.now()-t0), { route: meta.route, corr_id: meta.corr_id });
      
      // Convert to expected format
      const formattedResults: CorrectedValuationResults = {
        success: true,
        valuation: {
          estimatedValue: ainResult.estimated_value || 0,
          confidenceScore: ainResult.confidence_score || 0,
          basePrice: ainResult.base_value || ainResult.estimated_value || 0,
          adjustments: ainResult.adjustments || [],
          priceRange: [ainResult.price_range_low || 0, ainResult.price_range_high || 0],
          marketAnalysis: {
            dataSource: 'ain',
            listingCount: 0
          }
        }
      };
      
      setResults(formattedResults);
      toast.success('Valuation corrected and updated successfully!');
      
      return formattedResults;
    } catch (error) {
      console.error('❌ [useCorrectedValuation] Error:', error);
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