
/**
 * Format a date to a human-readable string
 * @param date - The date to format (Date object or string)
 * @param options - Intl.DateTimeFormatOptions object
 * @returns Formatted date string
 */
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
    
    // Check if the date is valid
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

/**
 * Format a date to show how long ago it was
 * @param date - The date to format (Date object or string)
 * @returns Human-readable time ago string (e.g., "5 minutes ago", "2 days ago")
 */
export const formatTimeAgo = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObject.getTime())) {
      console.warn('Invalid date provided to formatTimeAgo:', date);
      return '';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000);
    
    // Define time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    if (diffInSeconds < 5) {
      return 'just now';
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return '';
  }
};
