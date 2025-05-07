
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

/**
 * Draws the footer section of the PDF
 */
export function drawFooterSection(
  params: SectionParams,
  includeTimestamp: boolean = true
): void {
  const { page, margin, width, height, regularFont, boldFont } = params;
  const footerY = 30;
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: footerY + 15 },
    end: { x: width - margin, y: footerY + 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Draw footer text
  let footerText = "© Car Detective LLC - For informational purposes only";
  
  if (includeTimestamp) {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    footerText += ` - Generated on ${dateStr} at ${timeStr}`;
  }
  
  page.drawText(footerText, {
    x: margin,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw page number
  page.drawText("Page 1", {
    x: width - margin - 30,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
}
