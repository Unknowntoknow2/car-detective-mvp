
/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @param minimumFractionDigits Minimum number of decimal places
 * @param maximumFractionDigits Maximum number of decimal places
 * @returns A formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  minimumFractionDigits = 0,
  maximumFractionDigits = 0
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
}

/**
 * Format a date string or Date object to a human-readable format
 * @param date Date to format
 * @param options Options for date formatting
 * @returns A formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Formats a date relative to the current time (e.g., "5 minutes ago")
 * @param date The date to format
 * @returns A string representing the relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - targetDate.getTime();
  
  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  // Determine the appropriate unit and value
  if (timeDiff < minute) {
    return 'just now';
  } else if (timeDiff < hour) {
    const minutes = Math.floor(timeDiff / minute);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (timeDiff < day) {
    const hours = Math.floor(timeDiff / hour);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (timeDiff < week) {
    const days = Math.floor(timeDiff / day);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (timeDiff < month) {
    const weeks = Math.floor(timeDiff / week);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (timeDiff < year) {
    const months = Math.floor(timeDiff / month);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(timeDiff / year);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}
