
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
    make: valuationResult.make || '',
    model: valuationResult.model || '',
    year: valuationResult.year || new Date().getFullYear(),
    trim: valuationResult.trim || '',
    mileage: valuationResult.mileage || 0,
    vin: valuationResult.vin || '',
    
    // Valuation Information
    estimatedValue: valuationResult.estimatedValue || valuationResult.estimated_value || 0,
    price: valuationResult.estimatedValue || valuationResult.estimated_value || 0, // Add price for backward compatibility
    priceRange: Array.isArray(valuationResult.priceRange) ? valuationResult.priceRange as [number, number] : [0, 0],
    conditionAdjustment: getAdjustmentImpact(valuationResult, 'condition'),
    mileageAdjustment: getAdjustmentImpact(valuationResult, 'mileage'),
    locationAdjustment: getAdjustmentImpact(valuationResult, 'location'),
    marketAdjustment: getAdjustmentImpact(valuationResult, 'market'),
    
    // Condition Information
    aiCondition: typeof valuationResult.aiCondition === 'object' ? valuationResult.aiCondition : {
      condition: valuationResult.condition || 'Unknown',
      confidenceScore: valuationResult.confidenceScore || 75,
      issuesDetected: [],
      summary: `Vehicle is in ${valuationResult.condition || 'average'} condition.`
    },
    conditionScore: valuationResult.conditionScore || 0,
    
    // Location Information
    zipCode: valuationResult.zipCode || valuationResult.zip_code || valuationResult.zip || '',
    regionName: valuationResult.regionName || '',
    
    // Additional Information
    generatedDate: new Date(),
    generatedAt: new Date().toISOString(),
    explanation: explanation || generateDefaultExplanation(valuationResult),
    premium: false,
    
    // Add adjustments array for compatibility, ensuring description is always provided
    adjustments: Array.isArray(valuationResult.adjustments) 
      ? valuationResult.adjustments.map(a => ({
          factor: a.factor || '',
          impact: a.impact || 0,
          description: a.description || `Adjustment for ${a.factor}`
        }))
      : []
  };
}

/**
 * Helper function to get adjustment impact from valuation result
 */
function getAdjustmentImpact(valuationResult: ValuationResult, factor: string): number {
  if (!valuationResult.adjustments || !Array.isArray(valuationResult.adjustments)) {
    return 0;
  }
  
  const adjustment = valuationResult.adjustments.find(a => a.factor === factor);
  return adjustment ? (adjustment.impact || 0) : 0;
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
    photoUrl: valuationResult.photoUrl || valuationResult.photo_url || '',
    bestPhotoUrl: valuationResult.bestPhotoUrl || valuationResult.photo_url || '',
    photoScore: valuationResult.photoScore || 0,
    
    // Features
    features: valuationResult.features || [],
    
    // Premium flag
    premium: true,
    
    // Additional details
    fuelType: valuationResult.fuelType || valuationResult.fuel_type || '',
    transmission: valuationResult.transmission || '',
    bodyType: valuationResult.bodyType || valuationResult.bodyStyle || '',
    color: valuationResult.color || '',
    
    // Override condition with more detailed data if available
    aiCondition: valuationResult.aiCondition || { 
      summary: typeof valuationResult.condition === 'string' ? valuationResult.condition : '',
      condition: typeof valuationResult.condition === 'string' ? valuationResult.condition : '',
      confidenceScore: valuationResult.confidenceScore || 0,
      issuesDetected: []
    },
    conditionNotes: valuationResult.conditionNotes || []
  };
}

/**
 * Generate a default explanation if none is provided
 */
function generateDefaultExplanation(valuationResult: ValuationResult): string {
  return `
This valuation for the ${valuationResult.year || ''} ${valuationResult.make || ''} ${valuationResult.model || ''} ${valuationResult.trim || ''} 
is based on current market conditions and the vehicle's specific details.

The vehicle's condition (${typeof valuationResult.condition === 'string' ? valuationResult.condition : 'Average'}) and mileage (${(valuationResult.mileage || 0).toLocaleString()} miles) 
have been factored into this valuation, along with regional market trends for ${valuationResult.regionName || 'your area'}.

The estimated value represents the private party sale value. Dealership trade-in values 
may be approximately 10-15% lower than this estimate.
`.trim();
}
