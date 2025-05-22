
/**
 * Helper functions for safely accessing potentially undefined values in PDF generation
 */

export function safeAccess<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}

export function safeMargin(margin: number | undefined): number {
  return safeAccess(margin, 40); // Default margin of 40
}

export function safeWidth(width: number | undefined): number {
  return safeAccess(width, 595); // Default width of 595 (A4)
}

export function safeContentWidth(contentWidth: number | undefined): number {
  return safeAccess(contentWidth, 515); // Default content width
}

export function safeHeight(height: number | undefined): number {
  return safeAccess(height, 842); // Default height of 842 (A4)
}

export function safeString(value: string | undefined): string {
  return safeAccess(value, '');
}

export function safeNumber(value: number | undefined): number {
  return safeAccess(value, 0);
}

export function safeArray<T>(value: T[] | undefined): T[] {
  return safeAccess(value, []);
}

// Helper for safe indexing
export function safeIndex<T>(array: T[] | undefined, index: number): T | undefined {
  if (!array || index < 0 || index >= array.length) {
    return undefined;
  }
  return array[index];
}
