
import { PDFPage, rgb, Color, PDFFont } from 'pdf-lib';

/**
 * Draws a colored box with condition information
 */
export function drawConditionBox(
  page: PDFPage,
  condition: string | null,
  boxY: number,
  boxWidth: number,
  boxHeight: number,
  margin: number,
  conditionColor: Color
): void {
  // Draw box with light background color
  // Since the conditionColor could be RGB, CMYK, or Grayscale, we'll create a new light color
  // rather than trying to access properties that might not exist
  const lightBackgroundColor = rgb(0.95, 0.95, 0.95); // Light gray background
  
  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: lightBackgroundColor,
    opacity: 0.2,
    borderColor: conditionColor,
    borderWidth: 1,
  });
}
