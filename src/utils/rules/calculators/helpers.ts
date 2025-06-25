
// Enhanced calculator helpers
export function calculateBaseValue(make: string, model: string, year: number): number {
  // Mock implementation with more logic
  const baseValues: Record<string, number> = {
    'Toyota': 22000,
    'Honda': 21000,
    'Ford': 20000,
    'Chevrolet': 19000,
    'Nissan': 18000
  };
  
  const makeValue = baseValues[make] || 20000;
  const ageAdjustment = Math.max(0, (year - 2000) * 100);
  
  return makeValue + ageAdjustment;
}

export function applyAdjustment(baseValue: number, adjustment: number): number {
  return baseValue * (1 + adjustment);
}

/**
 * Utility function to calculate the sum of an array of numbers
 */
export const sum = (values: number[]): number => {
  return values.reduce((total, value) => total + value, 0);
};

/**
 * Utility function to calculate the average of an array of numbers
 */
export const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
};

/**
 * Utility function to find the maximum value in an array
 */
export const max = (values: number[]): number => {
  return Math.max(...values);
};

/**
 * Utility function to find the minimum value in an array
 */
export const min = (values: number[]): number => {
  return Math.min(...values);
};
