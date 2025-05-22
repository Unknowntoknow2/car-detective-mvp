
/**
 * Format a date string or Date object to "MMM DD, YYYY" format
 * @param date - The date to format (string or Date object)
 * @param locale - The locale to use for formatting (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | null | undefined,
  locale: string = 'en-US'
): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObject.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObject.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof date === 'string' ? date : 'Invalid Date';
  }
};
