<<<<<<< HEAD

// Re-export all formatters from the formatters directory
// This file exists for backward compatibility with existing imports

import { 
  formatCurrency
} from './formatters/formatCurrency';

import { 
  formatDate, 
  formatNumber, 
  formatRelativeTime,
  manualEntryToJson
} from './formatters/index';

export {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
  manualEntryToJson
};

// Add deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    'Warning: Importing from @/utils/formatters.ts is deprecated. ' +
    'Please import from @/utils/formatters/index.ts or specific formatter files instead.'
  );
}
=======
/**
 * Format a number as currency in USD
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

/**
 * Convert manual entry form data to JSON for API requests
 */
export const manualEntryToJson = (formData: any): string => {
  const cleanedData = {
    ...formData,
    year: Number(formData.year),
    mileage: Number(formData.mileage),
  };

  return JSON.stringify(cleanedData);
};

/**
 * Format a number with thousands separators
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  if (value == null) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a date relative to the current time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
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
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  }

  // Convert to hours
  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  // Convert to days
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  // For older dates, use the formatDate function
  return formatDate(dateString);
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
