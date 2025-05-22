
import { SectionParams } from '../types';

export function drawExplanationSection(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  if (!options.includeExplanation || !data.explanation) {
    return y; // Skip if explanation is not to be included
  }
  
  // Draw section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 15;
  
  // Split explanation into multiple lines for better readability
  const maxWidth = width - (margin * 2);
  const explanationText = data.explanation || '';
  const words = explanationText.split(' ');
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
