import { calculateMileageAdjustment } from '@/utils/valuation/mileageAdjustment';
import { calculateConditionAdjustment } from '@/utils/valuation/conditionAdjustment';
import { calculateTitleAdjustment } from '@/utils/valuation/titleAdjustment';
import { getMarketMultiplier } from '@/utils/valuation/marketData';
import { MarketDataService } from './marketDataService';
import { MarketListing } from '@/utils/types/unifiedTypes';
import { supabase } from '@/integrations/supabase/client';
import { valuationLogger } from '@/utils/valuationLogger';

export interface ValuationEngineInput {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
  decodedVehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    bodyType?: string;
  };
  fuelType?: string;
  titleStatus?: string;
  followUpData?: any;
}

export interface UnifiedValuationResult {
  finalValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  marketListings: any[];
  zipAdjustment: number;
  mileagePenalty: number;
  conditionDelta: number;
  titlePenalty: number;
  aiExplanation: string;
  sourcesUsed: string[];
  adjustments: any[];
  baseValue: number;
  explanation: string;
  marketListingsCount?: number;
  dataQuality?: string;
}

export async function calculateUnifiedValuation(input: ValuationEngineInput): Promise<UnifiedValuationResult> {
  console.log('🔍 Using Real Valuation Engine for calculation...');
  
  try {
    const { RealValuationEngine } = await import('@/services/valuation/realValuationEngine');
    
    const realResult = await RealValuationEngine.calculateValuation({
      vin: input.vin,
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      year: input.decodedVehicle.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode
    });

    if (!realResult.success) {
      throw new Error(realResult.error || 'Valuation calculation failed');
    }

    return {
      finalValue: realResult.estimatedValue,
      priceRange: realResult.priceRange,
      confidenceScore: realResult.confidenceScore,
      marketListings: [],
      zipAdjustment: 0,
      mileagePenalty: 0,
      conditionDelta: 0,
      titlePenalty: 0,
      aiExplanation: `Real market-based valuation using ${realResult.marketListingsCount} verified listings`,
      sourcesUsed: realResult.dataSourcesUsed,
      adjustments: realResult.adjustments,
      baseValue: realResult.estimatedValue - realResult.adjustments.reduce((sum, adj) => sum + adj.impact, 0),
      explanation: `Valuation based on ${realResult.marketListingsCount} real market listings`,
      marketListingsCount: realResult.marketListingsCount,
      dataQuality: realResult.confidenceScore >= 80 ? 'excellent' : 
                   realResult.confidenceScore >= 60 ? 'good' : 'fair'
    };

  } catch (error) {
    console.error('❌ Unified valuation error:', error);
    throw error;
  }
}