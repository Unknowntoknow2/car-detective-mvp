// /workspaces/car-detective-mvp/src/utils/mapValuationResult.ts

import { ValuationResult, AdjustmentBreakdown } from '@/types/valuation';

export function mapToValuationResult(raw: any): ValuationResult {
  if (!raw) throw new Error('No data to map');

  return {
    id: raw.id,
    make: raw.make,
    model: raw.model,
    year: raw.year,
    trim: raw.trim ?? raw.vehicle_data?.trim,
    mileage: raw.mileage,
    condition: raw.condition,
    estimatedValue: raw.estimated_value,
    confidenceScore: raw.confidence_score,
    priceRange: raw.price_range_low && raw.price_range_high
      ? [raw.price_range_low, raw.price_range_high]
      : raw.price_range || undefined,
    adjustments: raw.adjustments as AdjustmentBreakdown[] || [],
    basePrice: raw.base_price ?? raw.basePrice ?? raw.vehicle_data?.baseMSRP,
    baseValue: raw.base_value ?? raw.baseValue,
    finalValue: raw.final_value ?? raw.finalValue,
    features: raw.features,
    color: raw.color ?? raw.vehicle_data?.color,
    bodyStyle: raw.body_style ?? raw.bodyStyle ?? raw.vehicle_data?.bodyStyle,
    bodyType: raw.body_type ?? raw.bodyType ?? raw.vehicle_data?.bodyType,
    fuelType: raw.fuel_type ?? raw.fuelType ?? raw.vehicle_data?.fuelType,
    transmission: raw.transmission ?? raw.vehicle_data?.transmission,
    explanation: raw.explanation,
    bestPhotoUrl: raw.bestPhotoUrl ?? raw.vehicle_data?.bestPhotoUrl,
    photoScore: raw.photoScore ?? raw.vehicle_data?.photoScore,
    photoExplanation: raw.photoExplanation ?? raw.vehicle_data?.photoExplanation,
    vin: raw.vin,
    isPremium: typeof raw.isPremium === 'boolean'
      ? raw.isPremium
      : raw.valuation_type === 'premium',
    zipCode: raw.zip_code ?? raw.zipCode ?? raw.vehicle_data?.zipCode,
    createdAt: raw.created_at ?? raw.createdAt,
    competitorAverage: raw.competitorAverage ?? raw.marketAnalysis?.competitorAverage,
    marketAnalysis: raw.marketAnalysis,
    // Add others as needed!
  };
}
