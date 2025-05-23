
import { ValuationResult } from '@/types/valuation';
import { ReportData, AdjustmentItem } from './types';

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
    mileage: valuationResult.mileage || 0,
    vin: valuationResult.vin || '',
    
    // Valuation Information
    estimatedValue: valuationResult.estimatedValue || valuationResult.estimated_value || 0,
    confidenceScore: valuationResult.confidence_score || valuationResult.confidenceScore || 75,
    priceRange: Array.isArray(valuationResult.priceRange) ? valuationResult.priceRange as [number, number] : [0, 0],
    condition: valuationResult.condition || 'Good',
    
    // Additional adjustment data
    adjustments: Array.isArray(valuationResult.adjustments) 
      ? valuationResult.adjustments.map(a => ({
          factor: a.factor || '',
          impact: a.impact || 0,
          description: a.description || `Adjustment for ${a.factor}`
        }))
      : [],
    
    // Condition Information
    aiCondition: valuationResult.aiCondition || { // ✅ Fixed: Using aiCondition from valuationResult
      condition: valuationResult.condition || 'Unknown',
      confidenceScore: valuationResult.confidenceScore || 75,
      issuesDetected: [],
      summary: `Vehicle is in ${valuationResult.condition || 'average'} condition.`
    },
    
    // Location Information
    zipCode: valuationResult.zipCode || '', // ✅ Fixed: Using zipCode
    
    // Additional Information
    generatedAt: new Date().toISOString(),
    explanation: explanation || generateDefaultExplanation(valuationResult)
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
    
    // Premium flag
    isPremium: true,
    
    // Additional details
    fuelType: valuationResult.fuelType || valuationResult.fuel_type || '',
    
    // Override condition with more detailed data if available
    aiCondition: valuationResult.aiCondition || { // ✅ Fixed: Using aiCondition from valuationResult
      summary: typeof valuationResult.condition === 'string' ? valuationResult.condition : '',
      condition: typeof valuationResult.condition === 'string' ? valuationResult.condition : '',
      confidenceScore: valuationResult.confidenceScore || 0,
      issuesDetected: []
    }
  };
}

/**
 * Generate a default explanation if none is provided
 */
function generateDefaultExplanation(valuationResult: ValuationResult): string {
  return `
This valuation for the ${valuationResult.year || ''} ${valuationResult.make || ''} ${valuationResult.model || ''} 
is based on current market conditions and the vehicle's specific details.

The vehicle's condition (${typeof valuationResult.condition === 'string' ? valuationResult.condition : 'Average'}) and mileage (${(valuationResult.mileage || 0).toLocaleString()} miles) 
have been factored into this valuation, along with regional market trends for your area.

The estimated value represents the private party sale value. Dealership trade-in values 
may be approximately 10-15% lower than this estimate.
`.trim();
}
