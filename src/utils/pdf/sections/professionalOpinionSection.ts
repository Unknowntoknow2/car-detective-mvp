
import { SectionParams } from '../types';

export function drawProfessionalOpinionSection(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // This section is optional and only included in premium reports
  if (!data.isPremium) {
    return y;
  }
  
  // Draw section title
  page.drawText('Professional Opinion', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Sample professional opinion text
  const opinion = "Based on our analysis, this vehicle represents a fair value in the current market. " +
    "The condition is consistent with vehicles of similar age and mileage, and the price reflects current market trends. " +
    "We recommend a professional inspection before purchase as standard practice.";
  
  // Split the opinion into multiple lines
  const maxWidth = width - (margin * 2);
  const words = opinion.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = fonts.regular.widthOfTextAtSize(testLine, 9);
    
    if (textWidth > maxWidth) {
      page.drawText(currentLine, {
        x: margin,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      y -= 12;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  // Draw the last line if there's anything left
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 20;
  }
  
  return y; // Return the new Y position
}
