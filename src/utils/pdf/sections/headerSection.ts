
import { PDFDocument, PDFPage, PDFFont, rgb } from 'pdf-lib';

interface HeaderSectionProps {
  yPosition: number;
  width: number;
  margin: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  includeBranding?: boolean;
}

/**
 * Draws the header section of the valuation report
 * @returns The new vertical position after drawing the header
 */
export async function drawHeaderSection(
  pdfDoc: PDFDocument,
  page: PDFPage,
  props: HeaderSectionProps
): Promise<number> {
  const { yPosition, width, margin, regularFont, boldFont, includeBranding = true } = props;
  let currentY = yPosition;
  
  // Add title
  page.drawText('VEHICLE VALUATION REPORT', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 20;
  
  // Add subtitle with date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  page.drawText(`Generated on ${dateStr}`, {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  currentY -= 30;
  
  // Draw a line to separate the header from the content
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  currentY -= 20;
  
  return currentY;
}
