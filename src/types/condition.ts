
// Centralized condition types
export enum ConditionLevel {
  Poor = "Poor",
  Fair = "Fair",
  Good = "Good",
  VeryGood = "Very Good",
  Excellent = "Excellent"
}

export type ConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
export type TireConditionOption = 'excellent' | 'good' | 'worn' | 'replacement';
