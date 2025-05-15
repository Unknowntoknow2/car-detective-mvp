
/**
 * Format a number as currency
 * @param value - The numeric value to format
 * @param locale - The locale to use for formatting (default: en-US)
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  // If value is null or undefined, return $0
  if (value == null) return '$0';
  
  try {
    // Format as currency
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    }).format(value);
  } catch (error) {
    // Fallback in case of error
    return `$${value.toLocaleString()}`;
  }
};
