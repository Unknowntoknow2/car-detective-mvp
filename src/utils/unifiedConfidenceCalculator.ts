
import { InputFactors } from './confidenceCalculator';

/**
 * A unified interface for confidence scoring inputs that combines all possible factors
 */
export interface UnifiedConfidenceInput {
  // Vehicle identification
  vin?: string;
  zip?: string;
  
  // Basic vehicle data
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  
  // Vehicle condition
  condition?: string;
  
  // Data sources
  hasCarfax?: boolean;
  hasPhotoScore?: boolean;
  hasTitleStatus?: boolean;
  hasEquipment?: boolean;
  hasTransmission?: boolean;
  hasOpenRecall?: boolean;
  
  // Market data factors
  exactVinMatch?: boolean;
  marketListingsCount?: number;
  listingRange?: {min: number; max: number};
  estimatedValue?: number;
  
  // Data quality indicators
  msrpDataQuality?: number;
  fuelDataQuality?: number;
  
  // Source quality
  sourcesCount?: number;
  trustedSources?: string[];
  trustScore?: number;
}

/**
 * Detailed breakdown of confidence scores by category
 */
export interface ConfidenceBreakdown {
  vinAccuracy: number;
  marketData: number;
  fuelCostMatch: number;
  msrpQuality: number;
  overall: number;
  recommendations: string[];
}

/**
 * Calculates a unified confidence score across multiple dimensions
 * 
 * @param input All factors that affect confidence
 * @returns A complete confidence breakdown
 */
export function calculateUnifiedConfidence(input: UnifiedConfidenceInput): ConfidenceBreakdown {
  // Initialize with default values
  const breakdown: ConfidenceBreakdown = {
    vinAccuracy: 0,
    marketData: 0,
    fuelCostMatch: 0,
    msrpQuality: 0,
    overall: 0,
    recommendations: []
  };
  
  // VIN Accuracy calculation (0-100)
  if (input.vin && input.vin.length === 17) {
    breakdown.vinAccuracy = 85; // Base VIN presence
    
    // Exact VIN match is a strong positive
    if (input.exactVinMatch) {
      breakdown.vinAccuracy = 100;
    }
    // Deduct if basic vehicle data doesn't match VIN
    else if (!input.make || !input.model || !input.year) {
      breakdown.vinAccuracy = 65;
    }
  } else {
    breakdown.vinAccuracy = 40;
    breakdown.recommendations.push("Enter a valid 17-character VIN for improved accuracy");
  }
  
  // Market Data calculation (0-100)
  if (input.marketListingsCount && input.marketListingsCount > 0) {
    // Scale based on number of listings
    if (input.marketListingsCount >= 10) {
      breakdown.marketData = 90;
    } else if (input.marketListingsCount >= 5) {
      breakdown.marketData = 80;
    } else if (input.marketListingsCount >= 3) {
      breakdown.marketData = 75;
    } else {
      breakdown.marketData = 60;
    }
    
    // Add additional value for exact VIN match
    if (input.exactVinMatch) {
      breakdown.marketData = Math.min(100, breakdown.marketData + 10);
    }
    
    // Adjust based on price range spread (lower spread = higher confidence)
    if (input.listingRange && input.estimatedValue) {
      const spread = (input.listingRange.max - input.listingRange.min) / input.estimatedValue;
      if (spread < 0.1) breakdown.marketData = Math.min(100, breakdown.marketData + 5);
      else if (spread > 0.3) breakdown.marketData = Math.max(50, breakdown.marketData - 10);
    }
  } else {
    breakdown.marketData = 50;
    breakdown.recommendations.push("Add more vehicle details to improve market matching");
  }
  
  // Fuel Cost Match calculation (0-100)
  breakdown.fuelCostMatch = input.fuelDataQuality || (input.make && input.model ? 75 : 50);
  if (!input.year || !input.make || !input.model) {
    breakdown.recommendations.push("Complete basic vehicle information for better fuel economy estimates");
  }
  
  // MSRP Quality calculation (0-100)
  breakdown.msrpQuality = input.msrpDataQuality || 
    (input.make && input.model && input.year ? 80 : 50);
  
  // Calculate overall confidence as weighted average
  breakdown.overall = Math.round(
    (breakdown.vinAccuracy * 0.3) +
    (breakdown.marketData * 0.4) + 
    (breakdown.fuelCostMatch * 0.15) + 
    (breakdown.msrpQuality * 0.15)
  );
  
  // Add mileage recommendation if needed
  if (!input.mileage || input.mileage === 0) {
    breakdown.recommendations.push("Enter your vehicle's actual mileage for a more accurate valuation");
    breakdown.overall = Math.max(40, breakdown.overall - 10);
  }
  
  return breakdown;
}

/**
 * Gets a human-readable confidence level based on the score
 */
export function getConfidenceLevel(score: number): string {
  if (score >= 85) return "High Confidence";
  if (score >= 70) return "Good Confidence";
  if (score >= 50) return "Moderate Confidence";
  return "Low Confidence";
}

/**
 * Generates a natural language explanation of the confidence score
 */
export function generateConfidenceExplanation(
  score: number, 
  context: { 
    exactVinMatch?: boolean, 
    marketListings?: any[], 
    sources?: string[],
    trustScore?: number,
    mileagePenalty?: number,
    zipCode?: string
  }
): string {
  let explanation = "";
  
  if (score >= 85) {
    explanation = "High confidence based on comprehensive vehicle data";
    if (context.exactVinMatch) {
      explanation += " with exact VIN match in our market database.";
    } else {
      explanation += " and strong market comparables.";
    }
  } 
  else if (score >= 70) {
    explanation = "Good confidence level based on reliable vehicle data";
    if (context.marketListings && context.marketListings.length > 5) {
      explanation += ` and ${context.marketListings.length} market comparables.`;
    } else {
      explanation += ".";
    }
  }
  else if (score >= 50) {
    explanation = "Moderate confidence due to limited vehicle data. Adding more details would improve accuracy.";
  }
  else {
    explanation = "Low confidence due to insufficient vehicle information. Please provide more details for a better estimate.";
  }
  
  // Add context about specific factors
  if (context.exactVinMatch) {
    explanation += " Exact VIN match provides high-quality market data.";
  }
  
  return explanation;
}
