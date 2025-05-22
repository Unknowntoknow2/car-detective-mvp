
/**
 * Ensures the input is a valid string, returning a fallback if not
 */
export const safeString = (value: any, fallback: string = ''): string => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

/**
 * Safely gets a margin value, providing a default if undefined
 */
export const safeMargin = (margin: number | undefined, defaultMargin: number = 40): number => {
  return margin ?? defaultMargin;
};

/**
 * Safely gets page dimensions
 */
export const safeDimensions = (
  doc: any, 
  defaultWidth: number = 595, 
  defaultHeight: number = 842
): { width: number; height: number } => {
  return {
    width: doc.page?.width ?? defaultWidth,
    height: doc.page?.height ?? defaultHeight
  };
};

/**
 * Calculates content width based on page width and margins
 */
export const contentWidth = (pageWidth: number | undefined, margin: number | undefined): number => {
  const safeWidth = pageWidth ?? 595;
  const safeMarginValue = margin ?? 40;
  return safeWidth - (safeMarginValue * 2);
};
