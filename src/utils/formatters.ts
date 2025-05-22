
/**
 * Format a number as currency
 * @param value Number to format
 * @param notation Notation style for currency formatting
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, notation: string = 'standard'): string {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(value)) {
    return '$0';
  }
  
  // Create number formatter
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: notation as Intl.NumberFormatNotationOptions,
    maximumFractionDigits: 0
  });
  
  return formatter.format(value);
}
