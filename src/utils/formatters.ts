
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
