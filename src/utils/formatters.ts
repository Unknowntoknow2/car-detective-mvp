
// Re-export all formatters from the formatters directory
export * from './formatters/index';
export * from './formatters/formatCurrency';
export * from './formatters/formatDate';
export * from './formatters/formatNumber';
export * from './formatters/formatPercent';
export * from './formatters/formatPhone';
export * from './formatters/formatVin';
export * from './formatters/stringFormatters';

// Format currency for US market only
export const formatCurrency = (value: number, locale: string = 'en-US', currencyCode: string = 'USD'): string => {
  // If value is null or undefined, return $0
  if (value == null) return '$0';
  
  try {
    // Optimize for the common case - US dollars
    return `$${value.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    })}`;
  } catch (error) {
    // Fallback in case of error
    return `$${value.toLocaleString()}`;
  }
};

// Format date in US format (MM/DD/YYYY)
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US');
};

// Legacy formatter functions that need to be directly available from this file
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

export const manualEntryToJson = (data: any): string => {
  return JSON.stringify(data);
};
