
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
  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(
      conditionColor.red * 0.95 + 0.05,
      conditionColor.green * 0.95 + 0.05,
      conditionColor.blue * 0.95 + 0.05
    ),
    opacity: 0.2,
    borderColor: conditionColor,
    borderWidth: 1,
  });
}
