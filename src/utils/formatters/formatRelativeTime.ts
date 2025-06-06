
import { formatDate } from "./formatDate";

/**
 * Format a date to a relative time string (e.g., "5 minutes ago", "in 3 days")
 * @param date - The date to format (Date object, timestamp, or string)
 * @param relativeTo - The reference date (default: now)
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === "string"
    ? new Date(dateString)
    : dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Convert to seconds
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) {
    return "Just now";
  }

  // Convert to minutes
  const diffMins = Math.floor(diffSecs / 60);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  }

  // Convert to hours
  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }

  // Convert to days
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  // Convert to months
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  }

  // For older dates, use the formatDate function
  return formatDate(
    typeof dateString === "string" ? dateString : dateString.toISOString(),
  );
}
