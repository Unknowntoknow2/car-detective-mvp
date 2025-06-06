
/**
 * Format a number with thousands separators and decimals
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - The locale to use (default: en-US)
 * @returns Formatted number string
 */
export function formatNumber(number: number, decimals: number = 0): string {
  if (number === null || number === undefined || isNaN(number)) {
    return "0";
  }

  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
