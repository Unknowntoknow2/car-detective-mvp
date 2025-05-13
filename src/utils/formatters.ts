
/**
 * Utility functions for formatting values
 */

// Format a number as currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format a number with commas for thousands
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

// Format mileage with comma separators
export const formatMileage = (mileage: number): string => {
  return `${formatNumber(mileage)} mi`;
};

// Format a percentage
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
