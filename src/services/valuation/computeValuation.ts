import { ainGetValuation, type AINValuationInput } from "@/integrations/valuationClient";
import { calculateUnifiedValuation as localCalc } from "@/services/valuation/valuationEngine";

// Local -> AIN input adapter
function toAIN(input: any): AINValuationInput {
  return {
    vin: input?.vin,
    make: input?.decodedVehicle?.make || input?.make,
    model: input?.decodedVehicle?.model || input?.model,
    year: input?.decodedVehicle?.year || input?.year,
    mileage: input?.mileage || 0,
    condition: input?.condition ?? "good",
    zip: input?.zip ?? input?.zipCode,
    trim: input?.decodedVehicle?.trim || input?.trim
  };
}

// AIN -> Local result adapter (handles naming differences)
function toLocalResult(r: any) {
  if (r && "estimated_value" in r && "confidence_score" in r) {
    // Convert AIN result to local UnifiedValuationResult format
    return {
      finalValue: r.estimated_value,
      priceRange: [
        Math.round(r.estimated_value * 0.9),
        Math.round(r.estimated_value * 1.1)
      ] as [number, number],
      confidenceScore: r.confidence_score,
      marketListings: [],
      zipAdjustment: 0,
      mileagePenalty: 0,
      conditionDelta: 0,
      titlePenalty: 0,
      aiExplanation: `AIN API valuation with ${r.confidence_score}% confidence`,
      sourcesUsed: ['AIN_API'],
      adjustments: r.basis?.adjustments || [],
      baseValue: r.estimated_value,
      explanation: 'Valuation provided by AIN API',
      marketListingsCount: r.basis?.listing_count || 0,
      dataQuality: r.confidence_score >= 80 ? 'excellent' : 
                   r.confidence_score >= 60 ? 'good' : 'fair'
    };
  }
  return {
    finalValue: r?.finalValue ?? 0,
    priceRange: r?.priceRange ?? [0, 0],
    confidenceScore: r?.confidenceScore ?? 0,
    marketListings: r?.marketListings ?? [],
    zipAdjustment: r?.zipAdjustment ?? 0,
    mileagePenalty: r?.mileagePenalty ?? 0,
    conditionDelta: r?.conditionDelta ?? 0,
    titlePenalty: r?.titlePenalty ?? 0,
    aiExplanation: r?.aiExplanation ?? 'Unknown result format',
    sourcesUsed: r?.sourcesUsed ?? ['unknown'],
    adjustments: r?.adjustments ?? [],
    baseValue: r?.baseValue ?? 0,
    explanation: r?.explanation ?? 'Fallback result conversion'
  };
}

const USE_AIN = (import.meta.env.USE_AIN_VALUATION ?? "false") === "true";

export async function computeValuation(input: unknown) {
  if (!USE_AIN) return localCalc(input as any);
  try {
    const ain = await ainGetValuation(toAIN(input));
    return toLocalResult(ain);
  } catch (error) {
    console.warn('AIN API failed, falling back to local:', error);
    return localCalc(input as any); // per-request fallback
  }
}