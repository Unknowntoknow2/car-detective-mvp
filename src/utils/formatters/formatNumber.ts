
/**
 * Formats a number with commas as thousands separators
 * @param number - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(number: number, decimals: number = 0): string {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
