
import { fetchRules } from './confidenceRules';

export interface ConfidenceInput {
  vin?: string;
  zip?: string;
  mileage: number;
  year: number;
  make: string;
  model: string;
  condition: string;
  hasCarfax?: boolean;
  hasPhotoScore?: boolean; // Add photo score input
}

export function calculateConfidenceScore(input: ConfidenceInput): number {
  const rules = fetchRules();
  let score = 0;
  
  // VIN presence increases confidence
  if (input.vin) {
    score += rules.vin;
  }
  
  // ZIP code presence increases confidence
  if (input.zip) {
    score += rules.zip;
  }
  
  // Mileage presence increases confidence
  if (input.mileage > 0) {
    score += rules.mileage;
  }
  
  // Year, Make, Model presence increases confidence
  if (input.year && input.make && input.model) {
    score += rules.yearMakeModel;
  }
  
  // Condition information increases confidence
  if (input.condition) {
    score += rules.condition;
  }
  
  // Carfax presence increases confidence
  if (input.hasCarfax) {
    score += rules.carfax;
  }

  // Photo score increases confidence significantly
  if (input.hasPhotoScore) {
    score += 15; // Add 15 points for having a photo score
  }
  
  // Cap the score at 100
  return Math.min(score, 100);
}

export function getConfidenceLevel(score: number): string {
  if (score >= 90) {
    return 'Very High';
  } else if (score >= 75) {
    return 'High';
  } else if (score >= 50) {
    return 'Medium';
  } else if (score >= 25) {
    return 'Low';
  } else {
    return 'Very Low';
  }
}
