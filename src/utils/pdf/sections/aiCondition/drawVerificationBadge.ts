
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draw a verification badge based on confidence score
 */
export function drawVerificationBadge(
  page: PDFPage,
  confidenceScore: number,
  yPosition: number,
  width: number,
  margin: number,
  boldFont: PDFFont
): void {
  // Only show badge if confidence is high enough
  if (confidenceScore >= 70) {
    const badgeWidth = 120;
    const badgeHeight = 30;
    const badgeX = width - badgeWidth - margin - 10;
    const badgeY = yPosition + 10;
    
    // Draw verification badge
    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: badgeWidth,
      height: badgeHeight,
      color: rgb(0.9, 0.95, 1),
      borderColor: rgb(0, 0.5, 0.8),
      borderWidth: 1,
      opacity: 0.9,
    });
    
    // Add verification text
    page.drawText('✓ AI VERIFIED', {
      x: badgeX + 10,
      y: badgeY + 10,
      size: 12,
      font: boldFont,
      color: rgb(0, 0.5, 0.8)
    });
  }
}
