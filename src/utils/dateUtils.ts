
/**
 * Safely parses a date string or returns null if invalid
 * @param dateString The date string to parse
 */
export function safeDateParse(dateString: string | undefined | null): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a date or returns a fallback if the date is invalid
 * @param dateString The date string to format
 * @param fallback The fallback value to return if the date is invalid
 */
export function formatDate(dateString: string | undefined | null, fallback: string = 'N/A'): string {
  const date = safeDateParse(dateString);
  if (!date) return fallback;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
