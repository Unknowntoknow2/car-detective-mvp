
/**
 * Format currency values with appropriate locale and currency symbol
 * @param value The numeric value to format as currency
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format a date string into a more human-readable format
 * @param dateString The date string to format
 * @param options Additional formatting options
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

/**
 * Format large numbers with appropriate separators
 * @param value The numeric value to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format mileage with appropriate separators and unit
 * @param mileage The mileage value to format
 * @returns Formatted mileage string
 */
export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat('en-US').format(mileage)} mi`;
}

/**
 * Format a percentage value
 * @param value The decimal value to format as percentage (e.g., 0.15 for 15%)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a date relative to the current time (e.g., "2 days ago")
 * @param date The date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) {
    return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
  } else if (diffMonth > 0) {
    return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  } else if (diffDay > 0) {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  } else if (diffHour > 0) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  } else if (diffMin > 0) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  } else {
    return 'Just now';
  }
}
