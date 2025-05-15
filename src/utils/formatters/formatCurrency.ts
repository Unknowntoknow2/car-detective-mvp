
/**
 * Format a number as US currency
 * @param value - The numeric value to format
 * @returns Formatted currency string with $ symbol
 */
export const formatCurrency = (value: number): string => {
  // If value is null or undefined, return $0
  if (value == null) return '$0';
  
  try {
    // Format as US dollars
    return `$${value.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    })}`;
  } catch (error) {
    // Fallback in case of error
    return `$${value.toLocaleString()}`;
  }
};
