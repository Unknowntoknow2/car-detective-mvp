
// ✅ TS check passed
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

/**
 * Helper function to create a proper rotation object
 * @param angle The angle in degrees
 * @returns A properly formatted rotation object
 */
function degrees(angle: number) {
  return { 
    type: 'degrees' as const, 
    angle 
  };
}

/**
 * Draws the footer section of the PDF
 * @param params Section parameters including page and fonts
 * @param includeTimestamp Whether to include timestamp in footer
 * @param currentPage Current page number
 * @param totalPages Total number of pages
 * @param includeWatermark Whether to include watermark in footer
 */
export function drawFooterSection(
  params: SectionParams,
  includeTimestamp: boolean = true,
  currentPage: number = 1,
  totalPages: number = 1,
  includeWatermark: boolean = true
): void {
  const { page, width, height, margin, regularFont, contentWidth } = params;
  
  // Draw separator line
  page.drawLine({
    start: { x: margin, y: margin + 40 },
    end: { x: width - margin, y: margin + 40 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  // Draw Car Detective logo/text
  page.drawText("Car Detective™", {
    x: margin,
    y: margin + 20,
    size: 10,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });
  
  // Draw confidentiality notice
  if (includeWatermark) {
    page.drawText("Confidential - For authorized use only", {
      x: margin + 150,
      y: margin + 20,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  // Draw date and time if requested
  if (includeTimestamp) {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    page.drawText(`Generated: ${dateString}`, {
      x: margin,
      y: margin + 8,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  // Draw page numbers
  const pageText = `Page ${currentPage} of ${totalPages}`;
  const pageTextWidth = regularFont.widthOfTextAtSize(pageText, 8);
  
  page.drawText(pageText, {
    x: width - margin - pageTextWidth,
    y: margin + 8,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });
}

/**
 * Draws a watermarked footer with branded disclaimer
 * @param params Section parameters including page and fonts
 * @param companyName Company name to include in disclaimer
 * @param color Color for the footer text
 */
export function drawWatermarkedFooter(
  params: SectionParams,
  companyName: string,
  color: { r: number; g: number; b: number }
): void {
  const { page, width, height, margin, regularFont } = params;
  
  // Create disclaimer text
  const disclaimer = `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
  
  // Draw disclaimer at an angle
  page.drawText(disclaimer, {
    x: width / 2 - 100,
    y: 20,
    size: 8,
    font: regularFont,
    color: rgb(color.r, color.g, color.b),
    opacity: 0.6,
    rotate: degrees(10),
  });
}
