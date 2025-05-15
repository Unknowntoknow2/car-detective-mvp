
/**
 * Format a date using US locale formatting (MM/DD/YYYY)
 * @param date - The date to format, either as a Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US');
  } catch (error) {
    return 'Invalid date';
  }
};
