
import { SectionParams } from '../types';

export function drawValuationSummary(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Create a formatted valuation summary box
  const boxWidth = 300;
  const boxHeight = 100;
  const boxX = margin;
  const boxY = y - boxHeight;
  
  // Draw box outline
  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    borderColor: primaryColor,
    borderWidth: 1,
    color: { r: 0.97, g: 0.97, b: 1.0 }, // Very light blue background
  });
  
  // Draw the vehicle name
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: boxX + 15,
    y: boxY + boxHeight - 25,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  // Draw estimated value
  page.drawText('Estimated Value:', {
    x: boxX + 15,
    y: boxY + boxHeight - 50,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: boxX + 120,
    y: boxY + boxHeight - 50,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  // Draw price range
  if (data.priceRange && data.priceRange.length === 2) {
    page.drawText('Price Range:', {
      x: boxX + 15,
      y: boxY + boxHeight - 75,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(`$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: boxX + 120,
      y: boxY + boxHeight - 75,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
  }
  
  y = boxY - 10; // Update Y position to below the box
  
  return y; // Return the new Y position
}
