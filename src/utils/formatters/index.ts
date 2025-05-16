
export { formatNumber } from './formatNumber';

/**
 * Formats a date/time value relative to the current time (e.g., "2 hours ago")
 * @param date - The date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  
  // Convert to seconds
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds < 60) {
    return 'just now';
  }
  
  // Convert to minutes
  const diffMinutes = Math.floor(diffSeconds / 60);
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to hours
  const diffHours = Math.floor(diffMinutes / 60);
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to days
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to months
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to years
  const diffYears = Math.floor(diffMonths / 12);
  
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}
