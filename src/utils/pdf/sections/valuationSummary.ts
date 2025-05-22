
import { SectionParams } from '../types';
import { formatCurrency } from './sectionHelper';

export const drawValuationSummary = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  
  // Start position
  const startY = doc.y + 20;
  
  // Draw section title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Valuation Summary', margin, startY);
  
  // Add some spacing
  let currentY = startY + 30;
  
  // Draw estimated value
  doc.fontSize(22)
     .font('Helvetica-Bold')
     .fillColor('#0066cc')
     .text(formatCurrency(data.estimatedValue), margin, currentY);
  
  currentY += 30;
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length >= 2) {
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#333333')
       .text('Estimated Price Range:', margin, currentY);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text(`${formatCurrency(data.priceRange[0])} - ${formatCurrency(data.priceRange[1])}`, margin + 150, currentY);
    
    currentY += 20;
  }
  
  // Draw confidence score if available
  if (data.confidenceScore !== undefined) {
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#333333')
       .text('Confidence Score:', margin, currentY);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text(`${data.confidenceScore}%`, margin + 150, currentY);
    
    currentY += 20;
  }
  
  // Draw valuation date
  doc.fontSize(12)
     .font('Helvetica')
     .fillColor('#333333')
     .text('Valuation Date:', margin, currentY);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text(new Date().toLocaleDateString(), margin + 150, currentY);
  
  // Return the updated Y position
  return currentY + 30;
};
