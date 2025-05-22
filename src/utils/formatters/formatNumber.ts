
/**
 * Formats a number with commas as thousands separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(value: number | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  
  try {
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    return '0';
  }
}
