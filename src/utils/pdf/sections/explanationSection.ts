
import { SectionParams } from '../types';

/**
 * Draws the explanation section of the PDF
 */
export function drawExplanationSection(params: SectionParams): number {
  const { doc, data, margin = 40 } = params;
  const explanation = data.explanation || '';
  const sectionTitle = "Valuation Explanation";
  
  // Draw section title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .fillColor('#333333')
     .text(sectionTitle, margin, doc.y + 20);
  
  // Add some space
  doc.moveDown(1);
  
  // Draw explanation text
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#666666')
     .text(explanation, {
       width: doc.page.width - (margin * 2),
       align: 'left'
     });
  
  // Return the new vertical position after the explanation section
  return doc.y + 20;
}
