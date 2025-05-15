
/**
 * Formats a number as US currency with dollar sign
 * @param value The number to format
 * @param locale The locale to use, defaults to en-US
 * @param currencyCode The currency code to use, defaults to USD
 * @returns The formatted currency string
 */
export function formatCurrency(value: number, locale: string = 'en-US', currencyCode: string = 'USD'): string {
  // If value is null or undefined, return $0
  if (value == null) return '$0';
  
  try {
    if (currencyCode === 'USD') {
      // Optimize for the common case - US dollars
      return `$${value.toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2 
      })}`;
    }
    
    // For other currencies, use the full Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    // Fallback in case of invalid locale or currency code
    return `$${value.toLocaleString()}`;
  }
}
