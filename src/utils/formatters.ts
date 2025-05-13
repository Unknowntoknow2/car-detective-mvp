
/**
 * Formats a number as currency (USD by default)
 */
export const formatCurrency = (value: number, locale = 'en-US', currency = 'USD'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a number as a percentage
 */
export const formatPercentage = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

/**
 * Formats a number with commas for thousands
 */
export const formatNumber = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Formats a date to a string
 */
export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateStr: string | Date): string => {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return 'Just now';
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  }
  
  // For anything older, return formatted date
  return formatDate(date);
};

/**
 * Converts manual entry form data to a JSON string
 */
export const manualEntryToJson = (data: any): string => {
  try {
    // Clean the data to remove undefined values and ensure primitives
    const cleanData = Object.entries(data).reduce((obj, [key, value]) => {
      // Skip undefined values
      if (value === undefined) return obj;
      
      // Handle special cases
      if (Array.isArray(value)) {
        obj[key] = [...value];
      } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        obj[key] = JSON.stringify(value);
      } else {
        obj[key] = value;
      }
      
      return obj;
    }, {} as Record<string, any>);
    
    return JSON.stringify(cleanData);
  } catch (error) {
    console.error('Error converting form data to JSON:', error);
    return JSON.stringify({});
  }
};
