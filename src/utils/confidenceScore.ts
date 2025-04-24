
/**
 * Input parameters for calculating the confidence score
 */
export interface ConfidenceScoreInputs {
  vin?: string;
  zip?: string;
  mileage?: number;
  year?: string | number;
  make?: string;
  model?: string;
  condition?: string;
  hasCarfax?: boolean;
}

/**
 * Calculates a confidence score (0-100) based on available vehicle data
 * @param inputs Vehicle data points used for scoring
 * @returns Confidence score between 0 and 100
 */
export function calculateConfidenceScore(inputs: ConfidenceScoreInputs): number {
  let score = 0;

  // VIN provides the highest confidence boost as it's a unique identifier
  if (inputs.vin?.trim()) {
    score += 30;
  }

  // Location data helps with market-specific pricing
  if (inputs.zip?.trim()) {
    score += 15;
  }

  // Mileage is crucial for accurate valuation
  if (typeof inputs.mileage === 'number' && inputs.mileage >= 0) {
    score += 15;
  }

  // Basic vehicle identification (year/make/model)
  if (inputs.year && inputs.make?.trim() && inputs.model?.trim()) {
    score += 20;
  }

  // Vehicle condition affects value significantly
  if (inputs.condition?.trim()) {
    score += 10;
  }

  // CARFAX data provides additional verification
  if (inputs.hasCarfax) {
    score += 10;
  }

  // Ensure score stays within 0-100 range
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Get a human-readable description of the confidence score
 * @param score Confidence score between 0 and 100
 * @returns Description of the confidence level
 */
export function getConfidenceLevel(score: number): string {
  if (score >= 90) {
    return "Very High";
  } else if (score >= 70) {
    return "High";
  } else if (score >= 50) {
    return "Moderate";
  } else if (score >= 30) {
    return "Low";
  } else {
    return "Very Low";
  }
}
