
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';
import { formatCurrency } from '@/utils/formatters';

/**
 * Renders a valuation adjustment table in the PDF
 * 
 * @param params Section parameters for the PDF
 * @param basePrice The base vehicle price before adjustments
 * @param adjustments Array of adjustment items with factor, impact, and optional description
 * @param yPosition The Y position to start drawing the table
 * @returns The new Y position after drawing the table
 */
export function renderAdjustmentTable(
  params: SectionParams,
  basePrice: number,
  adjustments: Array<{ factor: string; impact: number; description?: string }>,
  yPosition: number
): number {
  const { page, margin, contentWidth, regularFont, boldFont } = params;
  let currentY = yPosition;
  
  // Title for the adjustments table
  page.drawText('Valuation Breakdown:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  currentY -= 20;
  
  // If no adjustments, display a message and exit
  if (!adjustments || adjustments.length === 0) {
    page.drawText('No adjustments applied. Final value equals base price.', {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    return currentY - 15;
  }
  
  // Draw the base price row
  const labelX = margin;
  const valueX = margin + contentWidth - 80;
  
  page.drawText('Base Price:', {
    x: labelX,
    y: currentY,
    size: 10,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText(formatCurrency(basePrice), {
    x: valueX,
    y: currentY,
    size: 10,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  currentY -= 15;
  
  // Draw each adjustment line
  for (const adjustment of adjustments) {
    const prefix = adjustment.impact >= 0 ? '+ ' : '- ';
    const absValue = Math.abs(adjustment.impact);
    
    page.drawText(`${prefix}${adjustment.factor}`, {
      x: labelX,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(`${prefix}${formatCurrency(absValue)}`, {
      x: valueX,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    currentY -= 15;
  }
  
  // Draw horizontal line before total
  page.drawLine({
    start: { x: valueX - 50, y: currentY + 5 },
    end: { x: valueX + 80, y: currentY + 5 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7)
  });
  
  currentY -= 15;
  
  // Calculate total value
  const totalValue = basePrice + adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  
  // Draw the final value
  page.drawText('Final Adjusted Value:', {
    x: labelX,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  page.drawText(formatCurrency(totalValue), {
    x: valueX,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  return currentY - 10;
}
