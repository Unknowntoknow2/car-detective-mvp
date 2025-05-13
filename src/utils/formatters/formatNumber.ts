
/**
 * Formats a number with commas for thousands
 * @param value The numeric value to format
 * @param locale The locale to use for formatting (default: 'en-US')
 * @returns A formatted number string
 */
export const formatNumber = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(value);
};
