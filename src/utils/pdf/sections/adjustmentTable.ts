
import { rgb, Color } from 'pdf-lib';
import { SectionParams } from '../types';

export async function addAdjustmentTable(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY - 300;
  const textColor = params.textColor || rgb(0.1, 0.1, 0.1);
  
  // Draw section title
  page.drawText('Adjustment Factors', {
    x: margin,
    y,
    size: 18,
    font: fonts.bold,
    color: textColor,
  });
  
  // Table header Y position
  let currentY = y - 40;
  
  // Column widths
  const factorWidth = 150;
  const impactWidth = 100;
  const descriptionWidth = pageWidth - margin * 2 - factorWidth - impactWidth;
  
  // Draw table header
  page.drawText('Factor', {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + factorWidth,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + factorWidth + impactWidth,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  // Draw line under header
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: pageWidth - margin, y: currentY - 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 30;
  
  // Draw adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    for (const adjustment of data.adjustments) {
      // Draw factor
      page.drawText(adjustment.factor, {
        x: margin,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: textColor,
      });
      
      // Draw impact (colorize based on positive/negative)
      const impactColor: Color = rgb(
        adjustment.impact < 0 ? 0.9 : 0.1,
        adjustment.impact > 0 ? 0.7 : 0.1,
        0.1
      );
      
      page.drawText('$' + adjustment.impact.toLocaleString(), {
        x: margin + factorWidth,
        y: currentY,
        size: 10,
        font: fonts.bold,
        color: impactColor,
      });
      
      // Draw description (if any)
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + factorWidth + impactWidth,
          y: currentY,
          size: 10,
          font: fonts.regular,
          color: textColor,
        });
      }
      
      currentY -= 20;
      
      // Add a new page if we're running out of space
      if (currentY < 50) {
        // TODO: Add new page and reset currentY
      }
    }
  } else {
    page.drawText('No adjustments available', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.italic || fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY;
}
