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
  const AUDIT_MODE = import.meta.env.VITE_FEATURE_AUDIT === "1";

  // Logger function gated behind audit flag
  const log = (level: 'info' | 'error' | 'warn', message: string, data?: any) => {
    if (AUDIT_MODE) {
      console[level](message, data);
    }
  };

  // Telemetry counters
  const emit = (event: string, data?: any) => {
    if (AUDIT_MODE) {
      console.info(`ain.${event}`, data);
    }
  };

  // Local path kept intact behind flag
  async function localCalculation(): Promise<UnifiedValuationResult> {
    log('info', '🔍 Using Real Valuation Engine for calculation...');
    
    try {
      const { RealValuationEngine } = await import('@/services/valuation/realValuationEngine');
      
      const realResult = await RealValuationEngine.calculateValuation({
        vin: input.vin,
        make: input.decodedVehicle?.make || '',
        model: input.decodedVehicle?.model || '',
        year: input.decodedVehicle?.year || 0,
        mileage: input.mileage,
        condition: input.condition,
        zipCode: input.zipCode
      });

      if (!realResult.success) {
        throw new Error(realResult.error || 'Valuation calculation failed');
      }

      emit('fallback.used', { reason: 'ain_disabled_or_failed' });

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
      log('error', '❌ Unified valuation error:', error);
      throw error;
    }
  }

  if (!USE_AIN) return localCalculation();

  log('info', '🔍 Using AIN Valuation API via secure edge function...');

  // Input null safety - guard decodedVehicle properties
  const vehicle = input.decodedVehicle;
  if (!vehicle?.make || !vehicle?.model || !vehicle?.year) {
    log('warn', 'Missing required vehicle data, falling back to local engine');
    return localCalculation();
  }

  // Prepare payload for secure edge function
  const ainPayload = {
    vin: input.vin,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    mileage: input.mileage,
    condition: input.condition ?? "good",
    zip: input.zipCode
  };

  const startTime = performance.now();

  try {
    // Get auth token for secure edge function call
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('Authentication required for AIN valuation');
    }

    // Call secure edge function (no API keys exposed)
    const edgeUrl = `https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/ain-valuation`;
    const response = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(ainPayload)
    });
    const latency = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errorText = await response.text();
      log('error', '❌ AIN edge function error:', { status: response.status, error: errorText });
      emit('err', { status: response.status, error: errorText, latency });
      throw new Error(`AIN edge error: ${response.status}`);
    }

    const ain = await response.json();

    // Emit telemetry
    emit('ok', { 
      value: ain.finalValue, 
      confidence: ain.confidenceScore,
      latency_ms: latency,
      comparables: ain.marketListingsCount || 0
    });
    emit('latency.ms', latency);

    // Normalize to UnifiedValuationResult shape
    const normalized: UnifiedValuationResult = {
      finalValue: ain.finalValue ?? 0,
      priceRange: ain.priceRange ?? [
        Math.round((ain.finalValue ?? 0) * 0.9),
        Math.round((ain.finalValue ?? 0) * 1.1)
      ],
      confidenceScore: ain.confidenceScore ?? 0,
      marketListings: [],
      zipAdjustment: 0,
      mileagePenalty: 0,
      conditionDelta: 0,
      titlePenalty: 0,
      aiExplanation: ain.explanation || `AIN AI valuation with ${ain.marketListingsCount || 'multiple'} market comparables`,
      sourcesUsed: ain.sourcesUsed || ['AIN_API'],
      adjustments: (ain.adjustments || []).map((adj: any) => ({
        factor: adj.factor,
        impact: adj.impact || adj.amount || 0,
        explanation: adj.description || adj.explanation || ''
      })),
      baseValue: ain.finalValue,
      explanation: ain.explanation || `Valuation provided by AIN API`,
      marketListingsCount: ain.marketListingsCount || 0,
      dataQuality: ain.confidenceScore >= 90 ? 'excellent' : 
                   ain.confidenceScore >= 70 ? 'good' : 'fair'
    };

    return normalized;

  } catch (error) {
    const latency = Math.round(performance.now() - startTime);
    
    // Abort handling - treat AbortError as retryable
    if (error instanceof DOMException && error.name === 'AbortError') {
      emit('err', { reason: 'timeout', latency_ms: latency });
      log('warn', '⏱️ AIN API timeout, falling back to local engine');
    } else {
      emit('err', { reason: 'network', latency_ms: latency });
      log('warn', '❌ AIN API failed, falling back to local engine:', error);
    }
    
    // Per-request graceful degradation
    return localCalculation();
  }
}