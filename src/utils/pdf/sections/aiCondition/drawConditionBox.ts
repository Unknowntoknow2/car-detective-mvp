
import { PDFPage, rgb, Color } from 'pdf-lib';

/**
 * Draw a box with styling based on condition
 */
export function drawConditionBox(
  page: PDFPage,
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null,
  boxY: number,
  boxWidth: number,
  boxHeight: number,
  margin: number,
  conditionColor: Color
): void {
  // Draw condition box with rounded corners
  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.97, 0.97, 0.97), // Light gray background
    borderColor: conditionColor,
    borderWidth: 2,
    opacity: 1,
  });
  
  // Add colored highlight at top of box
  page.drawRectangle({
    x: margin,
    y: boxY + boxHeight - 20,
    width: boxWidth,
    height: 20,
    color: conditionColor,
    opacity: 0.15,
  });
}
