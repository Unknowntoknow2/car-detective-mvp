
/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @param locale The locale to use (default: en-US)
 * @returns A formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
