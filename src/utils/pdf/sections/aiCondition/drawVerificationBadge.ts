
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draws an AI verification badge if confidence score is high enough
 */
export function drawVerificationBadge(
  page: PDFPage,
  confidenceScore: number,
  boxY: number, 
  width: number,
  margin: number,
  boldFont: PDFFont
): void {
  if (confidenceScore < 80) return;
  
  const verifiedText = 'AI Verified';
  const textWidth = boldFont.widthOfTextAtSize(verifiedText, 10);
  const badgeWidth = textWidth + 20;
  const badgeHeight = 20;
  const badgeX = width - margin - badgeWidth;
  const badgeY = boxY + 10;
  
  // Draw badge background
  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeWidth,
    height: badgeHeight,
    color: rgb(0.13, 0.7, 0.3), // Green
    borderColor: rgb(0.1, 0.6, 0.2),
    borderWidth: 1,
    opacity: 0.9,
  });
  
  // Draw badge text
  page.drawText(verifiedText, {
    x: badgeX + 10,
    y: badgeY + 6,
    size: 10,
    font: boldFont,
    color: rgb(1, 1, 1), // White
  });
}
