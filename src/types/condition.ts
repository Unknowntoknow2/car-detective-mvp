
// Centralized condition types
export enum ConditionLevel {
  Poor = "poor",
  Fair = "fair", 
  Good = "good",
  VeryGood = "very-good",
  Excellent = "excellent"
}

export type ConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
export type TireConditionOption = 'excellent' | 'good' | 'worn' | 'replacement';
export type BrakeConditionOption = 'excellent' | 'good' | 'worn' | 'replacement';

// Legacy aliases for backward compatibility
export const CONDITION_OPTIONS = [
  { value: 'excellent' as ConditionOption, label: 'Excellent' },
  { value: 'very-good' as ConditionOption, label: 'Very Good' },
  { value: 'good' as ConditionOption, label: 'Good' },
  { value: 'fair' as ConditionOption, label: 'Fair' },
  { value: 'poor' as ConditionOption, label: 'Poor' },
];
