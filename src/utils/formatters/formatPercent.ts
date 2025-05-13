
/**
 * Formats a number as a percentage
 * @param value The numeric value to format as percentage (0-100)
 * @param locale The locale to use for formatting (default: 'en-US')
 * @returns A formatted percentage string
 */
export const formatPercent = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
