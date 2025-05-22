
/**
 * Safely convert any value to a string
 * @param value The value to convert
 * @returns A string representation of the value
 */
export const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

/**
 * Safely get a number from a value or return a default
 * @param value The value to convert
 * @param defaultValue The default value to return if conversion fails
 * @returns A number
 */
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Safely get a property from an object with a default value
 * @param obj The object to get the property from
 * @param key The property key
 * @param defaultValue The default value to return if the property doesn't exist
 * @returns The property value or default value
 */
export const safeGet = <T>(obj: any, key: string, defaultValue: T): T => {
  if (!obj || (typeof obj !== 'object')) {
    return defaultValue;
  }
  return (obj[key] !== undefined && obj[key] !== null) ? obj[key] : defaultValue;
};

/**
 * Safely format a date to a string
 * @param date The date to format
 * @param options The date format options
 * @returns A formatted date string
 */
export const formatDate = (date: Date | string | undefined, options: Intl.DateTimeFormatOptions = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}): string => {
  if (!date) {
    return '';
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  } catch (e) {
    return '';
  }
};

/**
 * Format a currency value
 * @param value The value to format
 * @param currency The currency code
 * @returns A formatted currency string
 */
export const formatCurrency = (value: number | undefined, currency: string = 'USD'): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Ensure a value is within a range
 * @param value The value to check
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns The value clamped to the range
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Handle margin values safely
 * @param margin The margin value
 * @returns A safe margin value
 */
export const safeMargin = (margin?: number): number => {
  return margin ?? 40;
};

/**
 * Get safe dimensions from a PDF document
 * @param doc The PDF document
 * @returns An object with width and height
 */
export const safeDimensions = (doc: any): { width: number, height: number } => {
  const width = doc.page?.width || 595;
  const height = doc.page?.height || 842;
  return { width, height };
};

/**
 * Calculate content width based on page width and margin
 * @param width The page width
 * @param margin The margin
 * @returns The content width
 */
export const contentWidth = (width: number, margin: number): number => {
  return width - (margin * 2);
};
