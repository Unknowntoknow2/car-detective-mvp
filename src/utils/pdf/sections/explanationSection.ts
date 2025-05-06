
import { PDFPage, PDFFont, rgb, Color } from 'pdf-lib';

/**
 * Draws the explanation section on the PDF
 * Returns the new Y position after drawing
 */
export function drawExplanationSection(
  explanation: string | undefined,
  page: PDFPage,
  yPosition: number,
  margin: number,
  fonts: { regular: PDFFont; bold: PDFFont },
  titleColor: Color = rgb(0.12, 0.46, 0.70) // Default color
): number {
  if (!explanation) {
    return yPosition;
  }

  const { regular, bold } = fonts;
  
  // Draw section header
  page.drawText('Expert Commentary', {
    x: margin,
    y: yPosition,
    size: 16,
    font: bold,
    color: titleColor,
  });
  yPosition -= 25;

  // Break explanation into paragraphs
  const paragraphs = explanation.split(/\n\n|\r\n\r\n/);
  
  // Draw each paragraph
  paragraphs.forEach((paragraph) => {
    // Wrap text at about 80 characters per line
    const maxCharsPerLine = 80;
    let currentLine = '';
    const words = paragraph.split(' ');
    
    for (const word of words) {
      if ((currentLine + word).length > maxCharsPerLine) {
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: 12,
          font: regular,
        });
        yPosition -= 18;
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    
    if (currentLine.trim().length > 0) {
      page.drawText(currentLine, {
        x: margin,
        y: yPosition,
        size: 12,
        font: regular,
      });
      yPosition -= 18;
    }
    
    // Add space between paragraphs
    yPosition -= 8;
  });

  return yPosition;
}
