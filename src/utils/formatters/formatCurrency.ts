
/**
 * Format a number as USD currency
 * @param value - The numeric value to format
 * @param locale - The locale to use for formatting (default: en-US)
 * @param currencyCode - The currency code to use (default: USD)
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | null | undefined,
  locale: string = 'en-US',
  currencyCode: string = 'USD',
  options: Intl.NumberFormatOptions = {}
): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '$0.00';
  }
  
  try {
    // Default currency options
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
    
    // Merge with provided options
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Intl.NumberFormat(locale, mergedOptions).format(Number(value));
  } catch (error) {
    // Fallback in case of error
    console.error('Error formatting currency:', error);
    return `$${Number(value).toFixed(0)}`;
  }
};
