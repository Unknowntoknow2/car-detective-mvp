
import { SectionParams } from '../types';

export function drawValuePredictionSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor } = params;
  let y = startY;
  
  // This section is only included in premium reports
  if (!data.isPremium) {
    return y;
  }
  
  // Draw section title
  page.drawText('Value Prediction', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw prediction note
  const predictionText = "Based on market trends, we predict this vehicle's value will depreciate approximately 10-15% over the next 12 months. This is consistent with average depreciation rates for vehicles in this category.";
  
  // Split the text into multiple lines
  const maxWidth = width - (margin * 2);
  const words = predictionText.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, 9);
    
    if (textWidth > maxWidth) {
      page.drawText(currentLine, {
        x: margin,
        y,
        size: 9,
        font: font,
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
      font: font,
      color: textColor,
    });
    
    y -= 20;
  }
  
  return y; // Return the new Y position
}
