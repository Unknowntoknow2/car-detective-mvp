
import { PDFPage, PDFFont, rgb } from 'pdf-lib';
import { ReportData, SectionParams } from '../types';
import { formatCurrency } from '@/utils/formatters';

/**
 * Draws the valuation section of the PDF
 * @param params Section parameters for the PDF
 * @param data The vehicle and valuation data
 * @param yPosition The Y position to start drawing the section
 * @returns The new Y position after drawing the section
 */
export function drawValuationSection(
  params: SectionParams,
  data: ReportData,
  yPosition: number
): number {
  const { page, margin, width, regularFont, boldFont, contentWidth } = params;
  let currentY = yPosition;
  
  // Section heading
  page.drawText('Valuation Details', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 25;
  
  // Draw valuation details
  page.drawText(`Estimated Value: ${formatCurrency(data.estimatedValue)}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  currentY -= 20;
  
  page.drawText(`Condition: ${data.condition}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  currentY -= 20;
  
  page.drawText(`Mileage: ${data.mileage.toLocaleString()} miles`, {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });

  // Move down after basic details
  currentY -= 30;

  // Add adjustments section if available
  if (data.adjustments && data.adjustments.length > 0) {
    // Import the renderAdjustmentTable function
    const { renderAdjustmentTable } = require('./adjustmentTable');
    
    // Get the base price (can be derived from the final value minus adjustments)
    const totalAdjustment = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const basePrice = data.estimatedValue - totalAdjustment;
    
    // Render the adjustment table and get the new Y position
    currentY = renderAdjustmentTable(params, basePrice, data.adjustments, currentY);
  }
  
  currentY -= 20;
  
  // Confidence score section
  page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  return currentY;
}
