
export interface InputFactors {
  vin?: string;
  zip?: string;
  mileage: number;
  year: number;
  make: string;
  model: string;
  condition: string;
  hasCarfax: boolean;
  hasPhotoScore: boolean;
  hasTitleStatus: boolean;
  hasEquipment: boolean;
  hasTransmission?: boolean;
  hasOpenRecall?: boolean;
}

export function calculateConfidenceScore(input: InputFactors): number {
  let score = 0;

  // VIN and ZIP provide strong location and vehicle specific data
  if (input.vin) score += 20;
  if (input.zip) score += 10;

  // Mileage and year are crucial for depreciation
  score += Math.min(input.mileage / 10000, 10); // Scale mileage to a max of 10 points
  score += Math.min((new Date().getFullYear() - input.year) * 2, 10); // Scale age to a max of 10 points

  // Make and model provide a baseline
  if (input.make) score += 5;
  if (input.model) score += 5;

  // Condition is a direct assessment of quality
  if (input.condition) score += 10;

  // Carfax provides history
  if (input.hasCarfax) score += 15;

  // Photo score indicates visual appeal
  if (input.hasPhotoScore) score += 10;

  // Title status flags potential issues
  if (input.hasTitleStatus) score -= 10;

  // Equipment indicates features and desirability
  if (input.hasEquipment) score += 5;
  
  // Transmission type indicates desirability
  if (input.hasTransmission) score += 5;
  
  // Recall status affects safety and value
  if (input.hasOpenRecall) score -= 5;

  // Normalize the score to a percentage
  return Math.max(0, Math.min(score, 100));
}

export function getConfidenceLevel(score: number): string {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}
