
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatDate = (
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObject.getTime())) {
      console.warn('Invalid date provided to formatDate:', date);
      return '';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObject);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
