
import { PDFPage, rgb, Color } from 'pdf-lib';

/**
 * Draw a styled box for the condition display
 */
export function drawConditionBox(
  page: PDFPage,
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null,
  yPosition: number,
  boxWidth: number,
  boxHeight: number,
  margin: number,
  conditionColor: Color
): void {
  // Draw the main condition box with rounded corners effect
  page.drawRectangle({
    x: margin,
    y: yPosition,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.98, 0.98, 1),
    borderColor: conditionColor,
    borderWidth: 2,
    opacity: 0.9,
  });
  
  // Draw a colored header bar
  page.drawRectangle({
    x: margin,
    y: yPosition + boxHeight - 25,
    width: boxWidth,
    height: 25,
    color: conditionColor,
    opacity: 0.2,
  });
}
