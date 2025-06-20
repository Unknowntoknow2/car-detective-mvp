
/**
 * Utility function to calculate the sum of an array of numbers
 * @param values - Array of numbers to sum
 * @returns The sum of all values
 */
export const sum = (values: number[]): number => {
  return values.reduce((total, value) => total + value, 0);
};

/**
 * Utility function to calculate the average of an array of numbers
 * @param values - Array of numbers to average
 * @returns The average of all values
 */
export const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
};

/**
 * Utility function to find the maximum value in an array
 * @param values - Array of numbers
 * @returns The maximum value
 */
export const max = (values: number[]): number => {
  return Math.max(...values);
};

/**
 * Utility function to find the minimum value in an array
 * @param values - Array of numbers
 * @returns The minimum value
 */
export const min = (values: number[]): number => {
  return Math.min(...values);
};
