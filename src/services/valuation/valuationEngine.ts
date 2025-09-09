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
  const USE_AIN = (import.meta.env.USE_AIN_VALUATION ?? "false") === "true";

  // Local path kept intact behind flag
  async function localCalculation(): Promise<UnifiedValuationResult> {
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

  if (!USE_AIN) return localCalculation();

  // AIN path with timeout and safe fallback
  const BASE = import.meta.env.VITE_AIN_VALUATION_URL!;
  const KEY = import.meta.env.VITE_AIN_API_KEY!;
  const TIMEOUT = Number(import.meta.env.VITE_AIN_TIMEOUT_MS ?? 30000);

  console.log('🔍 Using AIN Valuation API for calculation...');

  // Adapters to avoid type drift
  const ainPayload = {
    vin: input.vin,
    make: input.decodedVehicle.make,
    model: input.decodedVehicle.model,
    year: input.decodedVehicle.year,
    mileage: input.mileage,
    condition: input.condition ?? "good",
    zip: input.zipCode,
    trim: input.decodedVehicle?.trim
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(`${BASE}/valuation`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KEY}`,
      },
      body: JSON.stringify(ainPayload),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`AIN ${res.status}`);

    const ain = await res.json();

    // Normalize to UnifiedValuationResult shape
    const normalized: UnifiedValuationResult = {
      finalValue: ain.estimated_value ?? ain.finalValue ?? 0,
      priceRange: ain.price_range ?? [
        Math.round((ain.estimated_value ?? 0) * 0.9),
        Math.round((ain.estimated_value ?? 0) * 1.1)
      ],
      confidenceScore: ain.confidence_score ?? ain.confidenceScore ?? 0,
      marketListings: ain.market_listings ?? [],
      zipAdjustment: 0,
      mileagePenalty: 0,
      conditionDelta: 0,
      titlePenalty: 0,
      aiExplanation: `AIN API valuation with ${ain.confidence_score ?? 0}% confidence`,
      sourcesUsed: ['AIN_API'],
      adjustments: ain.adjustments ?? [],
      baseValue: ain.base_value ?? ain.estimated_value ?? 0,
      explanation: 'Valuation provided by AIN API',
      marketListingsCount: ain.listing_count ?? 0,
      dataQuality: (ain.confidence_score ?? 0) >= 80 ? 'excellent' : 
                   (ain.confidence_score ?? 0) >= 60 ? 'good' : 'fair'
    };

    console.log('✅ AIN valuation completed:', normalized);
    return normalized;

  } catch (error) {
    console.warn('❌ AIN API failed, falling back to local engine:', error);
    // Per-request graceful degradation
    return localCalculation();
  } finally {
    clearTimeout(timer);
  }
}