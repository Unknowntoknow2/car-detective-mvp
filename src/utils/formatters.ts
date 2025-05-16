
/**
 * Format a number as currency in USD
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
