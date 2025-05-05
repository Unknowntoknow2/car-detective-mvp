
import { PDFPage, rgb, Color } from 'pdf-lib';

/**
 * Draw a styled box with the condition information
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
  // Draw box background
  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.97, 0.97, 0.97),
    borderColor: conditionColor,
    borderWidth: 1,
    borderOpacity: 0.5,
    opacity: 0.8,
  });
}
