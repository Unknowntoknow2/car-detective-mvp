
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

/**
 * Draws the footer section of the PDF document
 */
export function drawFooterSection(
  params: SectionParams,
  includeTimestamp = true,
  currentPage = 1,
  totalPages = 1,
  includeWatermark = true,
  additionalText = ''
) {
  const { page, width, height, margin, regularFont } = params;
  
  // Draw footer line
  page.drawLine({
    start: { x: margin, y: margin + 30 },
    end: { x: width - margin, y: margin + 30 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  // Draw copyright text
  const copyrightText = '© ' + new Date().getFullYear() + ' Car Detective';
  page.drawText(copyrightText, {
    x: margin,
    y: margin + 15,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw page number
  const pageText = `Page ${currentPage} of ${totalPages}`;
  const pageTextWidth = regularFont.widthOfTextAtSize(pageText, 8);
  page.drawText(pageText, {
    x: width - margin - pageTextWidth,
    y: margin + 15,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw timestamp if requested
  if (includeTimestamp) {
    const timestamp = new Date().toLocaleString();
    const timestampText = `Generated on: ${timestamp}`;
    const timestampWidth = regularFont.widthOfTextAtSize(timestampText, 8);
    const timestampX = (width - timestampWidth) / 2; // center timestamp
    
    page.drawText(timestampText, {
      x: timestampX,
      y: margin + 15,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
  
  // Add additional text if provided
  if (additionalText) {
    page.drawText(additionalText, {
      x: margin + 150,
      y: margin + 15,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
}
