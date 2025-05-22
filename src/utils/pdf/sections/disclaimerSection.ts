
import { SectionParams } from '../types';

/**
 * Draw disclaimer section on the PDF
 */
export const drawDisclaimerSection = (params: SectionParams) => {
  const { doc, data, margin = 40 } = params;
  const { disclaimerText } = data;

  // Calculate the current Y position
  const currentY = doc.y + 20;

  // Draw section title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Disclaimer', margin, currentY);

  // Draw disclaimer text
  doc.fontSize(10)
     .font('Helvetica')
     .text(disclaimerText, margin, currentY + 25, {
       width: (doc.page.width || 595) - (margin * 2),
       align: 'left'
     });

  return doc.y + 20; // Return the new Y position
};
