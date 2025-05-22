
/**
 * Format a number with commas and optional decimal places
 * @param value - The numeric value to format
 * @param locale - The locale to use for formatting (default: en-US)
 * @param decimalPlaces - Number of decimal places to show (default: 0)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  locale: string = 'en-US',
  decimalPlaces: number = 0
): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  
  try {
    return Number(value).toLocaleString(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  } catch (error) {
    // Fallback if toLocaleString fails
    return Number(value).toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};
