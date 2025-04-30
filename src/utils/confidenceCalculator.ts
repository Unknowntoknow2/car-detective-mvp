export interface InputFactors {
  vin?: string;
  zip?: string;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  condition?: string;
  hasCarfax?: boolean;
  hasPhotoScore?: boolean;
  hasTitleStatus?: boolean;
  hasEquipment?: boolean; // Add equipment factor
}

export function getConfidenceLevel(score: number): string {
  if (score >= 90) {
    return "Very High";
  } else if (score >= 80) {
    return "High";
  } else if (score >= 70) {
    return "Medium";
  } else {
    return "Low";
  }
}

const weights: Record<string, number> = {
  vin: 20,
  zip: 10,
  mileage: 15,
  year: 15,
  make: 10,
  model: 10,
  condition: 10,
  hasCarfax: 10,
  hasPhotoScore: 5,
  hasTitleStatus: 5,
  hasEquipment: 5 // Add weight for equipment
};

export function calculateConfidenceScore(factors: InputFactors): number {
  let score = 0;
  let possibleScore = 0;

  // Add scores for required factors
  if (factors.vin) {
    score += weights.vin;
    possibleScore += weights.vin;
  }
  if (factors.zip) {
    score += weights.zip;
    possibleScore += weights.zip;
  }
  if (factors.mileage) {
    score += weights.mileage;
    possibleScore += weights.mileage;
  }
  if (factors.year) {
    score += weights.year;
    possibleScore += weights.year;
  }
  if (factors.make) {
    score += weights.make;
    possibleScore += weights.make;
  }
  if (factors.model) {
    score += weights.model;
    possibleScore += weights.model;
  }
  if (factors.condition) {
    score += weights.condition;
    possibleScore += weights.condition;
  }

  // Add scores for optional factors
  if (factors.hasCarfax) score += weights.hasCarfax;
  if (factors.hasPhotoScore) score += weights.hasPhotoScore;
  if (factors.hasTitleStatus) score += weights.hasTitleStatus;
  if (factors.hasEquipment) score += weights.hasEquipment; // Add equipment score

  // Calculate completion percentage
  const completionPercentage = possibleScore > 0 ? (score / possibleScore) * 100 : 0;

  // Adjust the score based on completion percentage
  const finalScore = Math.min(100, Math.max(0, completionPercentage));

  return finalScore;
}
