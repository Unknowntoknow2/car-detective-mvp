
export function ensureNotUndefined<T>(value: T | undefined, defaultValue: T): T {
  return typeof value !== 'undefined' ? value : defaultValue;
}

// Safe helper function to handle possibly undefined values
export function safeValue<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}

// Additional helper functions for PDF generation
export function safeMargin(margin: number | undefined): number {
  return margin !== undefined ? margin : 40;
}

export function safeWidth(width: number | undefined): number {
  return width !== undefined ? width : 595;
}

export function safeContentWidth(contentWidth: number | undefined): number {
  return contentWidth !== undefined ? contentWidth : 515;
}

// Export these helpers to be used in other PDF section files
