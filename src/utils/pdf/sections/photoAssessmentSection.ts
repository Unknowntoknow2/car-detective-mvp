
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawPhotoAssessmentSection(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  if (!options.includePhotoAssessment || !data.aiCondition) {
    return y; // Skip if photo assessment is not to be included
  }
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw condition assessment
  if (data.aiCondition.condition) {
    page.drawText('Condition Assessment:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(data.aiCondition.condition, {
      x: margin + 150,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  }
  
  // Draw confidence score if available
  if (data.aiCondition.confidenceScore) {
    page.drawText('Assessment Confidence:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(`${data.aiCondition.confidenceScore}%`, {
      x: margin + 150,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 20;
  }
  
  // Draw issues detected if available
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    y -= 15;
    
    // List all issues
    for (const issue of data.aiCondition.issuesDetected) {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      y -= 12;
    }
    
    y -= 5;
  }
  
  // Draw summary if available
  if (data.aiCondition.summary) {
    page.drawText('Summary:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    y -= 15;
    
    // Split summary into multiple lines
    const maxWidth = width - (margin * 2) - 10; // Slight indent
    const words = data.aiCondition.summary.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = fonts.regular.widthOfTextAtSize(testLine, 9);
      
      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: margin + 10,
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
        x: margin + 10,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      y -= 20;
    }
  }
  
  return y; // Return the new Y position
}
