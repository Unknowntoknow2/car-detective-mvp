
/**
 * Formats a date in US format (MM/DD/YYYY)
 * @param date The date to format, can be Date object or string
 * @param locale The locale to use, defaults to en-US
 * @returns The formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString(locale, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    // Fallback formatting
    return typeof date === 'string' ? date : date.toDateString();
  }
}
