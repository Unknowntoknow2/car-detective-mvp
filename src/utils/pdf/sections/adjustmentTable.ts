
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';
import { AdjustmentBreakdown } from '@/utils/rules/types';
import { formatCurrency } from '@/utils/formatters';

/**
 * Renders an adjustment table in the PDF
 * @param params PDF section parameters
 * @param basePrice The base price before adjustments
 * @param adjustments Array of adjustment breakdowns
 * @param yPosition Current Y position in the PDF
 * @returns New Y position after drawing the table
 */
export function renderAdjustmentTable(
  params: SectionParams,
  basePrice: number,
  adjustments: AdjustmentBreakdown[],
  yPosition: number
): number {
  const { doc, page, margin, contentWidth, regularFont, boldFont } = params;

  if (!page || !doc) {
    console.error('PDF page or document not defined');
    return yPosition;
  }

  // Title
  let currentY = yPosition;
  page.drawText('Value Adjustments', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });

  currentY -= 20;

  // Base price row
  page.drawText('Base Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });

  page.drawText(formatCurrency(basePrice), {
    x: margin + (contentWidth || 0) - 100,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });

  currentY -= 15;

  // Draw separator line
  page.drawLine({
    start: { x: margin, y: currentY + 5 },
    end: { x: margin + (contentWidth || 0), y: currentY + 5 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });

  currentY -= 10;

  // Draw adjustments
  for (const adj of adjustments) {
    const adjValue = adj.value || adj.impact || 0;
    const isPositive = adjValue > 0;
    
    page.drawText(adj.name || adj.factor || 'Adjustment', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });

    page.drawText(`${isPositive ? '+' : ''}${formatCurrency(adjValue)}`, {
      x: margin + (contentWidth || 0) - 100,
      y: currentY,
      size: 11,
      font: regularFont,
      color: isPositive ? rgb(0.2, 0.7, 0.2) : rgb(0.8, 0.2, 0.2)
    });

    currentY -= 20;
  }

  // Draw separator line
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + (contentWidth || 0), y: currentY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });

  currentY -= 5;

  // Draw final value
  page.drawText('Final Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });

  const totalAdjustment = adjustments.reduce((sum, adj) => sum + (adj.value || adj.impact || 0), 0);
  const finalValue = basePrice + totalAdjustment;

  page.drawText(formatCurrency(finalValue), {
    x: margin + (contentWidth || 0) - 100,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });

  return currentY - 20;
}
