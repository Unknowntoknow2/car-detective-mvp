
import { PDFDocument, PDFPage, PDFFont, rgb } from 'pdf-lib';
import { ReportData } from '../types';

interface AIConditionSectionProps {
  yPosition: number;
  width: number;
  margin: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  data: ReportData;
}

/**
 * Draws the AI condition assessment section with photo in the PDF
 * @returns The new vertical position after drawing the section
 */
export async function drawAIConditionSection(
  pdfDoc: PDFDocument,
  page: PDFPage,
  props: AIConditionSectionProps
): Promise<number> {
  const { yPosition, width, margin, regularFont, boldFont, data } = props;
  let currentY = yPosition;
  
  // Section title
  page.drawText('AI Photo Assessment', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 20;
  
  // If there's a photo explanation, add it
  if (data.photoExplanation) {
    const explanationLines = wrapText(
      data.photoExplanation,
      regularFont,
      10,
      width - margin * 2
    );
    
    page.drawText('AI Observation:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    currentY -= 15;
    
    for (const line of explanationLines) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 10,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      currentY -= 12;
    }
  }
  
  currentY -= 15;
  
  // Add a line to separate this section
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  currentY -= 15;
  
  return currentY;
}

/**
 * Wraps text to fit within a given width
 */
function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
