
/**
 * Formats a number as a percentage
 * @param value The number to format (0.1 = 10%)
 * @param decimals The number of decimal places to show
 * @returns The formatted percentage string
 */
export function formatPercent(value: number, decimals: number = 0): string {
  if (value == null) return '0%';
  
  try {
    const percentValue = value * 100;
    return `${percentValue.toFixed(decimals)}%`;
  } catch (error) {
    return '0%';
  }
}
