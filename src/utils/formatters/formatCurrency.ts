
/**
 * Format a number as currency
 * @param value - The numeric value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | null | undefined): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '$0';
  }
  
  // Create number formatter with strict en-US locale and USD currency
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(Number(value));
  } catch (error) {
    // Fallback in case of error
    return `$${Number(value).toLocaleString('en-US', {maximumFractionDigits: 0})}`;
  }
};
