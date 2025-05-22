
import { SectionParams } from '../types';

/**
 * Draw the footer section of the PDF
 * @param params Section parameters
 */
export function drawFooterSection(params: SectionParams): void {
  const { 
    page, 
    data, 
    doc, 
    pageWidth = 600, // Default value if undefined
    pageHeight = 800, // Default value if undefined
    textColor = { r: 0, g: 0, b: 0 },
    regularFont,
    boldFont
  } = params;
  
  const footerY = 30;
  
  // Draw a line above the footer
  page.drawLine({
    start: { x: 50, y: footerY + 15 },
    end: { x: pageWidth - 50, y: footerY + 15 },
    thickness: 0.5,
    color: { r: 0.8, g: 0.8, b: 0.8 },
  });
  
  // Draw footer text - includes report date and company info if available
  const footerText = `Report generated on ${data.reportDate ? data.reportDate.toLocaleDateString() : new Date().toLocaleDateString()}${data.companyName ? ` by ${data.companyName}` : ''}${data.website ? ` | ${data.website}` : ''}`;
  
  page.drawText(footerText, {
    x: 50,
    y: footerY,
    size: 8,
    font: regularFont,
    color: textColor,
  });
  
  // Draw page number if multiple pages
  const pageNumber = `Page 1`;
  const pageNumberWidth = regularFont ? regularFont.widthOfTextAtSize(pageNumber, 8) : 30;
  
  page.drawText(pageNumber, {
    x: pageWidth - 50 - pageNumberWidth,
    y: footerY,
    size: 8,
    font: regularFont,
    color: textColor,
  });
}
