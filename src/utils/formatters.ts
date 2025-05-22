
/**
 * Format a number as currency
 */
export const formatCurrency = (value: number | string | undefined, currency: string = 'USD'): string => {
  if (value === undefined || value === null) return '$0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

/**
 * Format a number with commas
 */
export const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US').format(numValue);
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string | undefined, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { month: 'numeric', day: 'numeric', year: '2-digit' } :
    format === 'long' ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } :
    { month: 'short', day: 'numeric', year: 'numeric' };
    
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
