
import { AICondition } from '@/types/photo';
import { PDFPage, PDFFont, rgb } from 'pdf-lib';
import { drawSectionHeading, drawHorizontalLine } from '../components/pdfCommon';

interface AIConditionSectionParams {
  page: PDFPage;
  yPosition: number;
  margin: number;
  width: number;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
    italic: PDFFont;
  };
}

export async function drawAIConditionSection(
  aiCondition: AICondition,
  params: AIConditionSectionParams
): Promise<number> {
  const { page, yPosition, margin, width, fonts } = params;
  const { regular, bold, italic } = fonts;
  
  // Start position
  let currentY = yPosition;
  
  // Section heading
  currentY = drawSectionHeading(
    page,
    'AI Condition Assessment',
    currentY,
    margin,
    fonts.bold,
    16
  );
  currentY -= 15;
  
  // Condition score
  const conditionText = aiCondition.condition || 'Unknown';
  page.drawText('Vehicle Condition:', {
    x: margin,
    y: currentY,
    size: 11,
    font: bold,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  // Determine text color based on condition
  let conditionColor = rgb(0.2, 0.2, 0.2); // Default color
  
  switch (aiCondition.condition) {
    case 'Excellent':
      conditionColor = rgb(0.1, 0.6, 0.1); // Green
      break;
    case 'Good':
      conditionColor = rgb(0.1, 0.4, 0.7); // Blue
      break;
    case 'Fair':
      conditionColor = rgb(0.9, 0.6, 0.1); // Orange/Amber
      break;
    case 'Poor':
      conditionColor = rgb(0.8, 0.2, 0.2); // Red
      break;
  }
  
  // Draw the condition text
  page.drawText(conditionText, {
    x: margin + 120,
    y: currentY,
    size: 11,
    font: bold,
    color: conditionColor
  });
  
  currentY -= 20;
  
  // Confidence score
  page.drawText('Confidence Score:', {
    x: margin,
    y: currentY,
    size: 11,
    font: regular,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  page.drawText(`${aiCondition.confidenceScore}%`, {
    x: margin + 120,
    y: currentY,
    size: 11,
    font: regular,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  currentY -= 30;
  
  // AI Summary
  if (aiCondition.aiSummary) {
    page.drawText('Assessment Summary:', {
      x: margin,
      y: currentY,
      size: 11,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    currentY -= 20;
    
    // Draw the summary text - word wrapping would need to be implemented
    const maxWidth = width - (margin * 2);
    const words = aiCondition.aiSummary.split(' ');
    let line = '';
    const lineHeight = 15;
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const textWidth = regular.widthOfTextAtSize(testLine, 10);
      
      if (textWidth > maxWidth && line) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 10,
          font: regular,
          color: rgb(0.3, 0.3, 0.3)
        });
        
        line = word;
        currentY -= lineHeight;
      } else {
        line = testLine;
      }
    }
    
    // Draw the last line
    if (line) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 10,
        font: regular,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      currentY -= lineHeight;
    }
    
    currentY -= 15;
  }
  
  // Issues detected
  if (aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 11,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    currentY -= 20;
    
    // Draw each issue as a bullet point
    for (const issue of aiCondition.issuesDetected) {
      // Draw bullet
      page.drawText('•', {
        x: margin,
        y: currentY,
        size: 10,
        font: regular,
        color: rgb(0.8, 0.4, 0.1)
      });
      
      // Draw issue text
      page.drawText(issue, {
        x: margin + 15,
        y: currentY,
        size: 10,
        font: regular,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      currentY -= 15;
    }
    
    currentY -= 10;
  }
  
  // Draw a line at the bottom of the section
  drawHorizontalLine(page, margin, width - margin, currentY);
  
  // Return the new Y position
  return currentY - 10;
}
