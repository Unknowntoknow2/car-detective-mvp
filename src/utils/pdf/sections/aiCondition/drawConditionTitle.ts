
import { PDFPage, PDFFont, Color } from 'pdf-lib';

/**
 * Draw the condition title with appropriate styling
 */
export function drawConditionTitle(
  page: PDFPage,
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null,
  yPosition: number,
  xPosition: number,
  boldFont: PDFFont,
  conditionColor: Color
): void {
  if (!condition) return;
  
  // Draw the condition title
  page.drawText(`Condition: ${condition}`, {
    x: xPosition,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: conditionColor
  });
}
