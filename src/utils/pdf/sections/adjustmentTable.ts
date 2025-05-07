
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';
import { formatCurrency } from '@/utils/formatters';

/**
 * Renders a valuation adjustment table in the PDF document
 * 
 * @param params Section parameters for the PDF
 * @param basePrice The base price before adjustments
 * @param adjustments Array of adjustments with label and amount
 * @param yPosition The Y position to start drawing the table
 * @returns The new Y position after drawing the table
 */
export function renderAdjustmentTable(
  params: SectionParams,
  basePrice: number,
  adjustments: { factor: string; impact: number; description?: string }[],
  yPosition: number
): number {
  const { page, margin, width, regularFont, boldFont, contentWidth } = params;
  const leftColumnX = margin;
  const rightColumnX = margin + contentWidth - 100;
  let currentY = yPosition - 20;
  
  // Draw section title
  page.drawText("Valuation Breakdown:", {
    x: leftColumnX,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  currentY -= 25;
  
  // Draw base price row
  page.drawText("Base Price:", {
    x: leftColumnX,
    y: currentY,
    size: 11,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  page.drawText(formatCurrency(basePrice), {
    x: rightColumnX,
    y: currentY,
    size: 11,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  currentY -= 20;
  
  // If there are no adjustments, show a message
  if (!adjustments || adjustments.length === 0) {
    page.drawText("No adjustments applied. Final value equals base price.", {
      x: leftColumnX,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4)
    });
    
    currentY -= 30;
  } else {
    // Draw each adjustment row
    let totalAdjustment = 0;
    
    adjustments.forEach(adjustment => {
      // Format the label with +/- prefix
      const prefix = adjustment.impact >= 0 ? "+" : "";
      const label = `${adjustment.factor}`;
      const valueText = `${prefix}${formatCurrency(adjustment.impact)}`;
      const valueColor = adjustment.impact >= 0 
        ? rgb(0.2, 0.5, 0.2)  // Green for positive
        : rgb(0.6, 0.2, 0.2); // Red for negative
      
      // Draw the adjustment row
      page.drawText(label, {
        x: leftColumnX,
        y: currentY,
        size: 10,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      page.drawText(valueText, {
        x: rightColumnX,
        y: currentY,
        size: 10,
        font: regularFont,
        color: valueColor
      });
      
      // Add description if available (in smaller text)
      if (adjustment.description) {
        currentY -= 14;
        page.drawText(adjustment.description, {
          x: leftColumnX + 10, // Indented
          y: currentY,
          size: 8,
          font: regularFont,
          color: rgb(0.5, 0.5, 0.5),
          maxWidth: contentWidth - 120
        });
      }
      
      // Accumulate the total adjustment
      totalAdjustment += adjustment.impact;
      
      currentY -= 18;
    });
    
    // Add some space before the separator
    currentY -= 5;
  }
  
  // Draw separator line
  page.drawLine({
    start: { x: leftColumnX, y: currentY },
    end: { x: leftColumnX + contentWidth, y: currentY },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7)
  });
  
  currentY -= 15;
  
  // Calculate final value
  const finalValue = basePrice + adjustments.reduce((acc, adj) => acc + adj.impact, 0);
  
  // Draw final value row
  page.drawText("Final Adjusted Value:", {
    x: leftColumnX,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  page.drawText(formatCurrency(finalValue), {
    x: rightColumnX,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  // Add some space after the table
  currentY -= 30;
  
  return currentY;
}
