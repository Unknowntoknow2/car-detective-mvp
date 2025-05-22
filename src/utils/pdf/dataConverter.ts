
import { ValuationResult } from '@/types/valuation';
import { ReportData } from './types';

/**
 * Convert a basic valuation result to the PDF report data format
 */
export function convertBasicValuationToPdfData(
  valuationResult: ValuationResult,
  explanation?: string
): Partial<ReportData> {
  return {
    // Vehicle Information
    make: valuationResult.vehicle.make,
    model: valuationResult.vehicle.model,
    year: valuationResult.vehicle.year,
    trim: valuationResult.vehicle.trim,
    mileage: valuationResult.vehicle.mileage,
    vin: valuationResult.vehicle.vin,
    
    // Valuation Information
    estimatedValue: valuationResult.valuation.estimatedValue,
    priceRange: valuationResult.valuation.priceRange as [number, number],
    conditionAdjustment: valuationResult.valuation.adjustments?.find(a => a.factor === 'condition')?.impact,
    mileageAdjustment: valuationResult.valuation.adjustments?.find(a => a.factor === 'mileage')?.impact,
    locationAdjustment: valuationResult.valuation.adjustments?.find(a => a.factor === 'location')?.impact,
    marketAdjustment: valuationResult.valuation.adjustments?.find(a => a.factor === 'market')?.impact,
    
    // Condition Information
    aiCondition: valuationResult.vehicle.condition, // Updated from condition to aiCondition
    conditionScore: valuationResult.vehicle.conditionScore,
    
    // Location Information
    zipCode: valuationResult.vehicle.zipCode,
    regionName: valuationResult.location?.name,
    
    // Additional Information
    generatedDate: new Date(),
    explanation: explanation || generateDefaultExplanation(valuationResult),
    premium: false,
  };
}

/**
 * Convert a premium valuation result to the PDF report data format with additional details
 */
export function convertPremiumValuationToPdfData(
  valuationResult: ValuationResult,
  photoAssessment?: {
    exterior?: string[];
    interior?: string[];
    mechanical?: string[];
  },
  explanation?: string
): Partial<ReportData> {
  // Start with basic data
  const basicData = convertBasicValuationToPdfData(valuationResult, explanation);
  
  // Add premium-specific data
  return {
    ...basicData,
    
    // Photo Assessment
    photoAssessment,
    
    // Features
    features: valuationResult.vehicle.features,
    
    // Premium flag
    premium: true,
    
    // Override condition with more detailed data if available
    aiCondition: valuationResult.vehicle.condition, // Updated from condition to aiCondition
    conditionNotes: valuationResult.vehicle.conditionNotes,
  };
}

/**
 * Generate a default explanation if none is provided
 */
function generateDefaultExplanation(valuationResult: ValuationResult): string {
  const { vehicle, valuation } = valuationResult;
  
  return `
This valuation for the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''} 
is based on current market conditions and the vehicle's specific details.

The vehicle's condition (${vehicle.condition || 'Average'}) and mileage (${vehicle.mileage.toLocaleString()} miles) 
have been factored into this valuation, along with regional market trends for ${valuationResult.location?.name || 'your area'}.

The estimated value represents the private party sale value. Dealership trade-in values 
may be approximately 10-15% lower than this estimate.
`.trim();
}
