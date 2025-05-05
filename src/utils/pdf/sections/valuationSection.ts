
import { PDFPage, rgb } from 'pdf-lib';
import { PdfFonts, PdfConstants } from '../components/pdfCommon';
import { formatCurrency } from '../helpers/textUtils';

/**
 * Draw valuation section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawValuationSection(
  page: PDFPage,
  valuation: number,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, headingFontSize, normalFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Valuation section header
  page.drawText('Valuation', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: boldFont,
    color: rgb(0, 0, 0.8)
  });
  
  yPos -= 25;
  
  // Draw valuation amount
  page.drawText('Estimated Value:', {
    x: margin,
    y: yPos,
    size: normalFontSize,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText(`$${formatCurrency(valuation)}`, {
    x: margin + 120,
    y: yPos,
    size: 18,
    font: boldFont,
    color: rgb(0, 0.5, 0)
  });
  
  return yPos - 40; // Return new Y position
}
