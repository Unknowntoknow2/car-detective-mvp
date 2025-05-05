
import { PDFPage, rgb } from 'pdf-lib';
import { ReportData } from '../types';
import { PdfFonts, PdfConstants, drawSectionHeading } from '../components/pdfCommon';

/**
 * Draw valuation section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawValuationSection(
  page: PDFPage,
  data: ReportData,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, width, headingFontSize } = constants;
  const { regular, bold } = fonts;
  
  let currentY = yPos;
  
  // Draw section header
  currentY = drawSectionHeading(
    page, 
    'Valuation Result', 
    margin, 
    currentY, 
    headingFontSize, 
    bold,
    rgb(0.1, 0.6, 0.1)
  );
  
  // Draw valuation box
  const boxHeight = 100;
  page.drawRectangle({
    x: margin,
    y: currentY - boxHeight,
    width: width - (margin * 2),
    height: boxHeight,
    color: rgb(0.95, 1, 0.95),
    borderColor: rgb(0.1, 0.6, 0.1),
    borderWidth: 2,
  });
  
  // Format the value as currency
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.estimatedValue);
  
  // Draw estimated value
  page.drawText('Estimated Value:', {
    x: margin + 20,
    y: currentY - 30,
    size: 14,
    font: bold,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  // Draw the price in large font
  page.drawText(formattedValue, {
    x: margin + 20,
    y: currentY - 60,
    size: 28,
    font: bold,
    color: rgb(0.1, 0.6, 0.1)
  });
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
      x: margin + 20,
      y: currentY - 85,
      size: 12,
      font: regular,
      color: rgb(0.4, 0.4, 0.4)
    });
  }
  
  // Show condition
  page.drawText(`Vehicle Condition: ${data.condition || 'Not Specified'}`, {
    x: width - margin - 200,
    y: currentY - 30,
    size: 12,
    font: bold,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  // Return the updated y position
  return currentY - boxHeight - 10;
}
