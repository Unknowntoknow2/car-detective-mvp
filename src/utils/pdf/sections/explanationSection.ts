
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

/**
 * Draws the explanation section of the PDF
 */
export function drawExplanationSection(
  params: SectionParams,
  explanation: string,
  yPosition: number
): number {
  const { page, margin, regularFont, boldFont, contentWidth = 512 } = params;
  const sectionTitle = "Valuation Explanation";
  
  // Draw section title
  page.drawText(sectionTitle, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 25;
  
  // Break the explanation text into multiple lines
  const fontSize = 10;
  const lineHeight = 14;
  const maxWidth = contentWidth;
  const words = explanation.split(' ');
  let currentLine = '';
  let linesCount = 0;
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testLineWidth = regularFont.widthOfTextAtSize(testLine, fontSize);
    
    if (testLineWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      // Draw the current line and start a new one
      page.drawText(currentLine, {
        x: margin,
        y: yPosition - (linesCount * lineHeight),
        size: fontSize,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      
      linesCount++;
      currentLine = word;
    }
  }
  
  // Draw the last line
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y: yPosition - (linesCount * lineHeight),
      size: fontSize,
      font: regularFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    linesCount++;
  }
  
  // Return the new vertical position after the explanation section
  return yPosition - (linesCount * lineHeight) - 20;
}
