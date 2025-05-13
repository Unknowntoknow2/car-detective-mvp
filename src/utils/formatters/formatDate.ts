
/**
 * Formats a date into a readable string
 * @param date The date to format
 * @param format The date format (default: MM/DD/YYYY)
 * @returns A formatted date string
 */
export const formatDate = (date: Date | string | number, format = 'MM/DD/YYYY'): string => {
  const d = new Date(date);
  
  // Return empty string for invalid dates
  if (isNaN(d.getTime())) {
    return '';
  }
  
  // Simple date formatting for now - could be extended with a library like date-fns
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  // Replace tokens in format string
  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', year.toString());
};
