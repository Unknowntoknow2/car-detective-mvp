
import { useState } from 'react';
import { calculateUnifiedValuation, type ValuationEngineInput } from '@/services/valuation/valuationEngine';
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
      
      // Convert to ValuationEngineInput format
      const engineInput: ValuationEngineInput = {
        vin: params.vin,
        zipCode: params.zipCode,
        mileage: params.mileage,
        condition: params.condition,
        decodedVehicle: {
          year: params.year,
          make: params.make,
          model: params.model,
          trim: params.trim
        }
      };
      
      const result = await calculateUnifiedValuation(engineInput);
      
      // Convert to expected format
      const formattedResults: CorrectedValuationResults = {
        success: true,
        valuation: {
          estimatedValue: result.finalValue,
          confidenceScore: result.confidenceScore,
          basePrice: result.baseValue,
          adjustments: result.adjustments || [],
          priceRange: result.priceRange,
          marketAnalysis: {
            dataSource: result.sourcesUsed?.join(', ') || 'market_data',
            listingCount: result.marketListingsCount || 0
          }
        }
      };
      
      setResults(formattedResults);
      toast.success('Valuation corrected and updated successfully!');
      
      return formattedResults;
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
