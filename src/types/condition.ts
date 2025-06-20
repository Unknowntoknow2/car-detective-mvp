
export type TireConditionOption = 'excellent' | 'good' | 'worn' | 'replacement';
export type ConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
export type BrakeConditionOption = 'excellent' | 'good' | 'worn' | 'replacement';
export type ConditionLevel = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';

export const CONDITION_OPTIONS: { value: ConditionLevel; label: string }[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];
