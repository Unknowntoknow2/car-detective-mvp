
import { SectionParams } from '../types';

/**
 * Draws the header section of the valuation report
 * @returns The new vertical position after drawing the header
 */
export function drawHeaderSection(params: SectionParams): number {
  const { doc, data, margin = 40 } = params;
  
  // Current Y position
  const currentY = doc.y || 40;
  
  // Add title
  doc.fontSize(18)
     .font('Helvetica-Bold')
     .fillColor('#333333')
     .text(data.reportTitle || 'VEHICLE VALUATION REPORT', margin, currentY);
  
  // Add subtitle with date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#666666')
     .text(`Generated on ${dateStr}`, margin, currentY + 25);
  
  // Draw a line to separate the header from the content
  doc.strokeColor('#cccccc')
     .lineWidth(1)
     .moveTo(margin, currentY + 45)
     .lineTo(doc.page.width - margin, currentY + 45)
     .stroke();
  
  // Return the new vertical position
  return currentY + 60;
}
