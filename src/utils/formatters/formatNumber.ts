
/**
 * Formats a number with commas as thousand separators
 * @param value The number to format
 * @param decimals The number of decimal places to show
 * @returns The formatted number as a string
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (value == null) return '0';
  
  try {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    // Fallback in case of any errors
    return value.toString();
  }
}
