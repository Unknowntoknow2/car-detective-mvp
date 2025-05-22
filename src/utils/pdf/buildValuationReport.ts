
import { ValuationResult } from '@/types/valuation';

export const buildValuationReport = (result: ValuationResult | null, includeCarfax: boolean = false, templateType: 'basic' | 'premium' = 'basic') => {
  if (!result) {
    return {
      id: 'N/A',
      make: 'N/A',
      model: 'N/A',
      year: 0,
      mileage: 0,
      condition: 'N/A',
      price: 0,
      zipCode: 'N/A',
      vin: 'N/A',
      fuelType: 'N/A',
      transmission: 'N/A',
      color: 'N/A',
      bodyType: 'N/A',
      confidenceScore: 0,
      isPremium: false,
      priceRange: [0, 0] as [number, number],
      adjustments: [],
      generatedAt: new Date().toISOString(),
      explanation: 'N/A',
      userId: 'N/A',
    };
  }

  // Handle different price range formats
  let formattedPriceRange: [number, number] = [0, 0];
  if (Array.isArray(result.priceRange)) {
    if (result.priceRange.length >= 2) {
      formattedPriceRange = [result.priceRange[0], result.priceRange[1]];
    } else if (result.priceRange.length === 1) {
      formattedPriceRange = [result.priceRange[0], result.priceRange[0]];
    }
  } else if (result.priceRange && typeof result.priceRange === 'object' && 'min' in result.priceRange && 'max' in result.priceRange) {
    formattedPriceRange = [result.priceRange.min, result.priceRange.max];
  }

  return {
    id: result.id || 'N/A',
    make: result.make || 'N/A',
    model: result.model || 'N/A',
    year: result.year || 0,
    mileage: result.mileage || 0,
    condition: result.condition || 'N/A',
    price: result.estimatedValue || result.estimated_value || 0,
    zipCode: result.zipCode || result.zip_code || result.zip || 'N/A',
    vin: result.vin || 'N/A',
    fuelType: result.fuelType || result.fuel_type || 'N/A',
    transmission: result.transmission || 'N/A',
    color: result.color || 'N/A',
    bodyType: result.bodyType || result.bodyStyle || 'N/A',
    confidenceScore: result.confidenceScore || result.confidence_score || 0,
    isPremium: result.isPremium || result.is_premium || result.premium_unlocked || false,
    priceRange: formattedPriceRange,
    adjustments: result.adjustments || [],
    generatedAt: new Date().toISOString(),
    explanation: result.explanation || result.gptExplanation || 'N/A',
    userId: result.userId || 'N/A',
    trim: result.trim || 'N/A',
  };
};

export default buildValuationReport;
