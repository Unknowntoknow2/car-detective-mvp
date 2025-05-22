
import { SectionParams } from '../types';

export function drawHeaderSection(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y,
    size: 16,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw generated date if available
  if (data.generatedAt) {
    const date = new Date(data.generatedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    page.drawText(`Generated: ${formattedDate}`, {
      x: margin,
      y,
      size: 8,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 20;
  }
  
  return y; // Return the new Y position
}
