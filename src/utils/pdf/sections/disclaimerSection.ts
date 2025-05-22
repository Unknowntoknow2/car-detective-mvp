
import { SectionParams } from '../types';

export function drawDisclaimerSection(params: SectionParams): number {
  const { page, startY, margin, width, fonts, textColor } = params;
  let y = startY;
  
  const disclaimer = 'DISCLAIMER: This valuation is an estimate based on market data and the vehicle information provided. Actual sale prices may vary based on factors not considered in this report including but not limited to local market conditions, vehicle history, and specific vehicle features. This report is not a guarantee of any specific sale price.';
  
  // Split disclaimer into multiple lines for better readability
  const maxWidth = width - (margin * 2);
  const words = disclaimer.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = fonts.regular.widthOfTextAtSize(testLine, 7);
    
    if (textWidth > maxWidth) {
      // Draw the current line and move to next line
      page.drawText(currentLine, {
        x: margin,
        y,
        size: 7,
        font: fonts.regular,
        color: textColor,
        opacity: 0.7,
      });
      
      y -= 10;
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
      size: 7,
      font: fonts.regular,
      color: textColor,
      opacity: 0.7,
    });
    
    y -= 10;
  }
  
  return y; // Return the new Y position
}
