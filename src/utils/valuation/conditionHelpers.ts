
import { ConditionValues } from '@/components/valuation/condition/types';

/**
 * Maps a numeric condition score to a descriptive string
 */
export function getConditionLabel(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

/**
 * Returns a tailwind class for coloring based on condition
 */
export function getConditionColorClass(condition: string): string {
  switch (condition) {
    case 'Excellent': return 'text-green-600';
    case 'Good': return 'text-blue-600';
    case 'Fair': return 'text-amber-600';
    case 'Poor': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Returns tips for improving the vehicle condition
 */
export function getConditionTips(condition: string): string {
  switch (condition) {
    case 'Excellent': 
      return 'Continue meticulous maintenance to preserve top-tier condition.';
    case 'Good': 
      return 'Regular maintenance and minor detailing can maintain current condition.';
    case 'Fair': 
      return 'Minor repairs and maintenance can significantly improve vehicle value.';
    case 'Poor': 
      return 'Major repairs needed: address significant mechanical or body damage, prioritize essential fixes.';
    default: 
      return 'Regular maintenance is recommended for all vehicles.';
  }
}

/**
 * Gets the impact value of a condition on valuation
 */
export function getConditionValueImpact(condition: string): number {
  switch (condition) {
    case 'Excellent': return 15;
    case 'Good': return 5;
    case 'Fair': return -5;
    case 'Poor': return -15;
    default: return 0;
  }
}

/**
 * Generates default condition values
 */
export function getDefaultConditionValues(): ConditionValues {
  return {
    accidents: 0,
    mileage: 0,
    year: new Date().getFullYear(),
    titleStatus: 'Clean',
    exteriorGrade: 80,
    interiorGrade: 80,
    mechanicalGrade: 80,
    tireCondition: 80
  };
}
