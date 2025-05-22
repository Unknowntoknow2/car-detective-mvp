
/**
 * Formats a number as currency
 * @param value The number to format 
 * @param currency The currency code (default: USD)
 * @param locale The locale code (default: en-US)
 * @returns Formatted currency string
 * 
 * @deprecated Import from @/utils/formatters instead
 */
export function formatCurrency(
  value: number | null | undefined, 
  currency = 'USD',
  locale = 'en-US'
): string {
  if (value === null || value === undefined) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
