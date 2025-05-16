
/**
 * Format a number with thousands separators
 * @param value - Number to format
 * @param decimals - Number of decimal places to include
 * @returns Formatted number string with thousands separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (value == null) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}
