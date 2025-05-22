
import { ReportData, SectionParams } from '../types';
import { formatCurrency } from './sectionHelper';

export const drawValuationSection = (params: SectionParams, reportData: ReportData): number => {
  const { doc, margin = 40 } = params;
  
  // Current Y position
  const currentY = doc.y + 20;
  
  // Draw title
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#333333')
     .text('Valuation', margin, currentY);
  
  // Draw estimated value
  const estimatedValue = reportData.estimatedValue || reportData.price || 0;
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .fillColor('#0077CC')
     .text(formatCurrency(estimatedValue), margin, currentY + 30);
  
  // Draw price range if available
  if (reportData.priceRange && reportData.priceRange.length >= 2) {
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#666666')
       .text(
         `Price Range: ${formatCurrency(reportData.priceRange[0])} - ${formatCurrency(reportData.priceRange[1])}`,
         margin,
         currentY + 70
       );
  }
  
  // Return new Y position
  return currentY + 100;
};
