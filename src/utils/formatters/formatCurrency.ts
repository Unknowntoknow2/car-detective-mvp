/**
 * Format a number as USD currency
 * @param value - The numeric value to format
 * @param locale - The locale to use for formatting (default: en-US)
 * @param currencyCode - The currency code to use (default: USD)
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted currency string
 */
export const formatCurrency = (
<<<<<<< HEAD
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
=======
  value: number,
  locale: string = "en-US",
  currency: string = "USD",
): string => {
  // If value is null or undefined, return $0
  if (value == null) return "$0";

  try {
    // Format as currency
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  } catch (error) {
    // Fallback in case of error
    console.error('Error formatting currency:', error);
    return `$${Number(value).toFixed(0)}`;
  }
};
