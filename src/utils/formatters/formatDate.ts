
/**
 * Format a date to "MMM DD, YYYY" in U.S. format
 * @param date - The date to format, either as a Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return '';
  }
};
