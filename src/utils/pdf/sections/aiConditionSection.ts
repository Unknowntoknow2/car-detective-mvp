
import { PDFPage, rgb } from 'pdf-lib';
import { AICondition } from '@/types/photo';

interface DrawAIConditionSectionProps {
  page: PDFPage;
  yPosition: number;
  margin: number;
  width: number;
  fonts: {
    regular: any;
    bold: any;
    italic: any;
  };
}

/**
 * Draw AI Condition Assessment section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawAIConditionSection(
  aiCondition: AICondition,
  props: DrawAIConditionSectionProps
): number {
  const { page, yPosition, margin, width, fonts } = props;
  const { regular, bold, italic } = fonts;
  
  let currentY = yPosition;
  
  // Draw section header
  page.drawText('AI Condition Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: bold,
    color: rgb(0.1, 0.4, 0.6)
  });
  
  currentY -= 25;
  
  // Draw condition
  page.drawText(`Condition: ${aiCondition.condition || 'Not specified'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0)
  });
  
  currentY -= 20;
  
  // Draw confidence score
  page.drawText(`AI Confidence Score: ${aiCondition.confidenceScore}%`, {
    x: margin,
    y: currentY,
    size: 12,
    font: regular,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  currentY -= 20;
  
  // Draw summary if available
  if (aiCondition.aiSummary) {
    page.drawText('AI Assessment:', {
      x: margin,
      y: currentY,
      size: 12,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    currentY -= 20;
    
    // Split summary into lines to fit width
    const maxWidth = width - (margin * 2);
    const words = aiCondition.aiSummary.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const textWidth = regular.widthOfTextAtSize(testLine, 12);
      
      if (textWidth > maxWidth && line) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 12,
          font: regular,
          color: rgb(0.1, 0.1, 0.1)
        });
        
        currentY -= 16;
        line = word;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 12,
        font: regular,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      currentY -= 20;
    }
  }
  
  // List issues if available
  if (aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 12,
      font: bold,
      color: rgb(0.6, 0.2, 0.2)
    });
    
    currentY -= 20;
    
    aiCondition.issuesDetected.forEach(issue => {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regular,
        color: rgb(0.4, 0.1, 0.1)
      });
      
      currentY -= 16;
    });
  }
  
  return currentY;
}
