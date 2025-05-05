
import { PDFPage, rgb } from 'pdf-lib';
import { PdfFonts, PdfConstants } from '../components/pdfCommon';
import { getCurrentDate } from '../helpers/textUtils';

/**
 * Draw header section on the PDF
 * Returns the new Y position after drawing the header
 */
export function drawHeaderSection(
  page: PDFPage,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, width, titleFontSize, smallFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Set up title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: yPos,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0, 0, 0.8)
  });
  
  // Add current date
  const currentDate = getCurrentDate();
  page.drawText(`Generated on: ${currentDate}`, {
    x: width - margin - 150,
    y: yPos,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: yPos - titleFontSize - 15 },
    end: { x: width - margin, y: yPos - titleFontSize - 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  return yPos - titleFontSize - 50;
}

/**
 * Draw footer section on the PDF
 */
export function drawFooterSection(
  page: PDFPage,
  fonts: PdfFonts,
  constants: PdfConstants
): void {
  const { margin, smallFontSize } = constants;
  const { regular: regularFont } = fonts;
  
  // Footer
  const footerText = "This valuation is an estimate based on current market data and may vary.";
  page.drawText(footerText, {
    x: margin,
    y: margin - 20,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
}
