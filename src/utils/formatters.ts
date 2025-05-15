
/**
 * Formats a number as currency
 * @param value The value to format
 * @param locale The locale to use (default: 'en-US')
 * @param currency The currency to use (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  locale = 'en-US', 
  currency = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a date string to a localized date format
 * @param dateString The date string to format
 * @param locale The locale to use (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  locale = 'en-US'
): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Formats a number as a percentage
 * @param value The value to format (0-100)
 * @param decimalPlaces The number of decimal places to include
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number, 
  decimalPlaces = 0
): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Truncates a string to a maximum length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (
  str: string,
  maxLength: number
): string => {
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength) + '...';
};
