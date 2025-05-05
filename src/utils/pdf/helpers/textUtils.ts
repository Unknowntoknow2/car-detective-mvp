
import { PDFFont } from 'pdf-lib';

/**
 * Helper function to wrap text to fit within a specified width
 */
export function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const width = font.widthOfTextAtSize(currentLine + word + ' ', fontSize);
    
    if (width < maxWidth) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  }
  
  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim());
  }
  
  return lines;
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString();
}

/**
 * Get current date formatted as a string
 */
export function getCurrentDate(): string {
  return new Date().toLocaleDateString();
}
