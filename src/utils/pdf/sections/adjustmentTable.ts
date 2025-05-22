
import { SectionParams, AdjustmentItem } from '../types';

export function drawAdjustmentsTable(params: SectionParams): number {
  const { page, startY, margin, data, font, boldFont, textColor } = params;
  let y = startY;
  
  if (!data.adjustments || data.adjustments.length === 0) {
    return y; // No adjustments to draw
  }
  
  // Draw table header
  page.drawText('Value Adjustments', {
    x: margin,
    y,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  y -= 20;
  
  // Draw column headers
  page.drawText('Factor', {
    x: margin,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + 180,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + 250,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  y -= 15;
  
  // Draw each adjustment row
  for (const adjustment of data.adjustments) {
    // Factor
    page.drawText(adjustment.factor, {
      x: margin,
      y,
      size: 9,
      font: font,
      color: textColor,
    });
    
    // Impact (positive in green, negative in red)
    const impact = adjustment.impact;
    const impactColor = impact >= 0 
      ? { r: 0, g: 0.5, b: 0 } // Green for positive
      : { r: 0.8, g: 0, b: 0 }; // Red for negative
    
    page.drawText(`${impact >= 0 ? '+' : ''}$${Math.abs(impact).toLocaleString()}`, {
      x: margin + 180,
      y,
      size: 9,
      font: font,
      color: impactColor,
    });
    
    // Description (if available)
    if (adjustment.description) {
      page.drawText(adjustment.description, {
        x: margin + 250,
        y,
        size: 9,
        font: font,
        color: textColor,
      });
    }
    
    y -= 15; // Move down for next row
  }
  
  return y; // Return the new Y position
}
