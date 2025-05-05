
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draw explanation section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawExplanationSection(
  explanation: string | undefined,
  page: PDFPage,
  yPosition: number,
  margin: number,
  width: number,
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  }
): number {
  if (!explanation) {
    return yPosition;
  }
  
  let currentY = yPosition - 20;
  const { regular, bold } = fonts;
  const primaryColor = rgb(0.12, 0.46, 0.70);
  
  page.drawText('Valuation Explanation:', {
    x: margin,
    y: currentY,
    size: 14,
    font: bold,
    color: primaryColor,
  });
  currentY -= 20;
  
  // Simple word wrapping for explanation
  const maxWidth = width - (margin * 2);
  const words = explanation.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = regular.widthOfTextAtSize(testLine, 10);
    
    if (testWidth > maxWidth) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 10,
        font: regular,
      });
      currentY -= 15;
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  
  // Draw remaining text
  if (line.trim() !== '') {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 10,
      font: regular,
    });
    currentY -= 20;
  }
  
  return currentY;
}
