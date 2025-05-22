
/**
 * Safe string helper to prevent null/undefined values
 */
export const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Format currency value
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Get safe margin value with fallback
 */
export const safeMargin = (margin?: number): number => {
  return margin || 40;
};

/**
 * Calculate content width based on page width and margins
 */
export const contentWidth = (pageWidth: number, margin: number): number => {
  return pageWidth - (margin * 2);
};

/**
 * Get safe dimensions with fallbacks
 */
export const safeDimensions = (params: {
  width?: number;
  height?: number;
  doc: any;
}): { width: number; height: number } => {
  return {
    width: params.width || params.doc.page.width,
    height: params.height || params.doc.page.height
  };
};

/**
 * Get photo score adjustment description
 */
export const getPhotoScoreAdjustmentDescription = (
  photoScore: number,
  percentAdjustment: number,
  adjustment: number
): string => {
  if (percentAdjustment > 0) {
    return `Vehicle appears to be in excellent condition based on photos (score: ${photoScore.toFixed(2)})`;
  } else if (percentAdjustment < 0) {
    return `Vehicle appears to be in below average condition based on photos (score: ${photoScore.toFixed(2)})`;
  } else {
    return `Vehicle appears to be in good condition based on photos (score: ${photoScore.toFixed(2)})`;
  }
};

/**
 * Safely check if a property exists and has a value
 */
export const hasValue = (obj: any, property: string): boolean => {
  return obj && property in obj && obj[property] !== null && obj[property] !== undefined;
};
