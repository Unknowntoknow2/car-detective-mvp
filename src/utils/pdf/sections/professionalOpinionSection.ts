
import { SectionParams } from '../types';

export function drawProfessionalOpinionSection(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  // Only include this section for premium reports
  if (options.isPremium !== true && data.isPremium !== true) {
    return y;
  }
  
  // Draw section title
  page.drawText('Professional Opinion', {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 15;
  
  // Sample professional opinion text
  const opinionText = 
    "Based on our expert assessment, this vehicle appears to be in line with market expectations for its age, mileage, and condition. " + 
    "The maintenance history and condition details provided suggest the vehicle has been well-maintained.";
  
  // Split text into multiple lines for better readability
  const maxWidth = width - (margin * 2);
  const words = opinionText.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = fonts.regular.widthOfTextAtSize(testLine, 9);
    
    if (textWidth > maxWidth) {
      // Draw the current line and move to next line
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
