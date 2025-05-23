
/**
 * Format a date to a relative time string (e.g., "5 minutes ago", "in 3 days")
 * @param date - The date to format (Date object, timestamp, or string)
 * @param relativeTo - The reference date (default: now)
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: Date | number | string | null | undefined,
  relativeTo: Date | number | string = new Date()
): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
      
    const relativeToObj = typeof relativeTo === 'string' || typeof relativeTo === 'number'
      ? new Date(relativeTo)
      : relativeTo;
    
    // Check if dates are valid
    if (isNaN(dateObj.getTime()) || isNaN(relativeToObj.getTime())) {
      console.warn('Invalid date in formatRelativeTime', { date, relativeTo });
      return '';
    }
    
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffInMS = dateObj.getTime() - relativeToObj.getTime();
    const diffInSeconds = Math.round(diffInMS / 1000);
    
    // Define time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    // Find the appropriate interval
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(Math.round(diffInSeconds), 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.round(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 604800) {
      return rtf.format(Math.round(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return rtf.format(Math.round(diffInSeconds / 604800), 'week');
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return rtf.format(Math.round(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(Math.round(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    console.error('Error in formatRelativeTime:', error);
    
    // Fallback if Intl.RelativeTimeFormat is not supported
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format a timespan in milliseconds to a human-readable duration
 * @param milliseconds - Duration in milliseconds
 * @param includeSeconds - Whether to include seconds in output (default: true)
 * @returns Formatted duration string (e.g., "2h 30m 15s" or "2h 30m")
 */
export const formatDuration = (
  milliseconds: number | null | undefined,
  includeSeconds: boolean = true
): string => {
  if (!milliseconds || milliseconds <= 0 || isNaN(milliseconds)) {
    return includeSeconds ? '0s' : '0m';
  }
  
  try {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    
    const parts: string[] = [];
    
    if (days > 0) {
      parts.push(`${days}d`);
    }
    
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    
    if (includeSeconds && seconds > 0) {
      parts.push(`${seconds}s`);
    }
    
    return parts.length > 0 ? parts.join(' ') : (includeSeconds ? '0s' : '0m');
  } catch (error) {
    console.error('Error in formatDuration:', error);
    return includeSeconds ? '0s' : '0m';
  }
};
