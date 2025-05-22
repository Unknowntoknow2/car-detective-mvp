
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawValuationSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw estimated value
  page.drawText('Estimated Value:', {
    x: margin,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: margin + 120,
    y,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    page.drawText('Price Range:', {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: margin + 120,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 20;
  }
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText('Confidence Score:', {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    // Draw the score text
    page.drawText(`${data.confidenceScore}%`, {
      x: margin + 120,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 15;
    
    // Draw confidence score bar
    const barWidth = 150;
    const barHeight = 10;
    const x = margin + 120;
    
    // Draw background bar
    page.drawRectangle({
      x,
      y: y - barHeight,
      width: barWidth,
      height: barHeight,
      color: rgb(0.9, 0.9, 0.9), // Light gray
    });
    
    // Draw filled portion of bar
    const fillWidth = barWidth * (data.confidenceScore / 100);
    page.drawRectangle({
      x,
      y: y - barHeight,
      width: fillWidth,
      height: barHeight,
      color: primaryColor,
    });
    
    y -= 25;
  }
  
  return y; // Return the new Y position
}
