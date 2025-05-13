
/**
 * Formats a number as currency (USD by default)
 * @param value The numeric value to format as currency
 * @param locale The locale to use for formatting (default: 'en-US')
 * @param currency The currency code to use (default: 'USD')
 * @returns A formatted currency string
 */
export const formatCurrency = (value: number, locale = 'en-US', currency = 'USD'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
