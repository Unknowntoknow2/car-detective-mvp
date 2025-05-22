
import { SectionParams, AdjustmentBreakdown } from '../types';
import { safeString, formatCurrency } from './sectionHelper';

export const drawAdjustmentTable = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  const { adjustments = [] } = data;
  
  if (!adjustments || adjustments.length === 0) {
    return doc.y;
  }
  
  // Set the current Y position
  const startY = doc.y + 20;
  
  // Draw section title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Value Adjustments', margin, startY);
  
  // Draw table headers
  const tableTop = startY + 30;
  const tableWidth = doc.page.width - (margin * 2);
  const colWidths = [tableWidth * 0.4, tableWidth * 0.2, tableWidth * 0.4];
  const rowHeight = 25;
  
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Factor', margin, tableTop)
     .text('Impact', margin + colWidths[0], tableTop)
     .text('Description', margin + colWidths[0] + colWidths[1], tableTop);
  
  // Draw divider line
  doc.moveTo(margin, tableTop + 20)
     .lineTo(margin + tableWidth, tableTop + 20)
     .stroke();
  
  // Draw rows
  let currentY = tableTop + 30;
  adjustments.forEach((adjustment: any) => {
    const factor = safeString(adjustment.factor);
    const impact = formatCurrency(adjustment.impact);
    const description = safeString(adjustment.description || '');
    
    doc.fontSize(12)
       .font('Helvetica')
       .text(factor, margin, currentY)
       .text(impact, margin + colWidths[0], currentY)
       .text(description, margin + colWidths[0] + colWidths[1], currentY);
    
    currentY += rowHeight;
  });
  
  // Draw footer line
  doc.moveTo(margin, currentY + 5)
     .lineTo(margin + tableWidth, currentY + 5)
     .stroke();
  
  // Calculate total adjustments
  const total = adjustments.reduce((sum: number, adj: any) => sum + adj.impact, 0);
  
  // Draw total
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Total Adjustments:', margin, currentY + 15)
     .text(formatCurrency(total), margin + colWidths[0], currentY + 15);
  
  return currentY + 40;
};
