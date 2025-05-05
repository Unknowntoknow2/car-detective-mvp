
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draw a verification badge based on the confidence score
 */
export function drawVerificationBadge(
  page: PDFPage,
  confidenceScore: number,
  boxY: number,
  width: number,
  margin: number,
  bold: PDFFont
): void {
  if (confidenceScore >= 80) {
    // Draw verification badge
    const badgeX = width - margin - 120;
    const badgeY = boxY + 55;
    
    // Badge background
    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: 110,
      height: 30,
      color: rgb(0.13, 0.7, 0.3), // Green
      borderColor: rgb(0.1, 0.6, 0.2),
      borderWidth: 1,
      opacity: 0.2,
    });
    
    // Badge text
    page.drawText(`AI VERIFIED ${confidenceScore}%`, {
      x: badgeX + 15,
      y: badgeY + 10,
      size: 10,
      font: bold,
      color: rgb(0.13, 0.7, 0.3), // Green
    });
  }
}
