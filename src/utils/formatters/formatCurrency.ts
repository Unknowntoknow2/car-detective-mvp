
/**
 * Format a number as currency
 * @param value - The numeric value to format
 * @param locale - The locale to use for formatting (default: en-US)
 * @param currency - The currency code to use (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | null | undefined, 
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '$0';
  }
  
  // Create number formatter with USD and en-US locale
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(Number(value));
  } catch (error) {
    // Fallback in case of error
    return `$${Number(value).toLocaleString('en-US', {maximumFractionDigits: 0})}`;
  }
};
