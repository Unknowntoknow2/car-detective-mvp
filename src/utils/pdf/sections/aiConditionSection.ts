
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

interface DrawAIConditionOptions {
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

/**
 * Draw the AI Condition Assessment section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawAIConditionSection(
  aiCondition: AICondition | null | undefined,
  options: DrawAIConditionOptions
): number {
  if (!aiCondition) {
    return options.yPosition;
  }

  const { page, yPosition, margin, width, fonts } = options;
  const { regular, bold, italic } = fonts;
  
  let currentY = yPosition;
  const primaryColor = rgb(0.12, 0.46, 0.70);
  
  // Define colors based on condition
  let conditionColor = rgb(0.5, 0.5, 0.5); // Default gray
  const confidenceScore = aiCondition.confidenceScore || 0;
  
  if (aiCondition.condition === 'Excellent') {
    conditionColor = rgb(0.13, 0.7, 0.3); // Green
  } else if (aiCondition.condition === 'Good') {
    conditionColor = rgb(0.95, 0.7, 0.1); // Yellow/Gold
  } else if (aiCondition.condition === 'Fair' || aiCondition.condition === 'Poor') {
    conditionColor = rgb(0.9, 0.3, 0.2); // Red
  }
  
  // Draw title with brain emoji
  page.drawText('🧠 AI Vehicle Condition Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: bold,
    color: primaryColor,
  });
  currentY -= 25;
  
  // Draw colored box background
  const boxWidth = width - (margin * 2);
  const boxHeight = 100;  // Adjust based on content
  const boxY = currentY - boxHeight + 15;
  
  // Draw box with light background color
  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(
      conditionColor.red * 0.95 + 0.05,
      conditionColor.green * 0.95 + 0.05,
      conditionColor.blue * 0.95 + 0.05
    ),
    opacity: 0.2,
    borderColor: conditionColor,
    borderWidth: 1,
  });
  
  // Draw condition in large bold text
  page.drawText(`Condition: ${aiCondition.condition || 'Unknown'}`, {
    x: margin + 15,
    y: currentY - 5,
    size: 14,
    font: bold,
    color: conditionColor,
  });
  currentY -= 20;
  
  // Draw confidence score
  page.drawText(`Confidence Score: ${confidenceScore}%`, {
    x: margin + 15,
    y: currentY,
    size: 12,
    font: regular,
    color: rgb(0.3, 0.3, 0.3),
  });
  currentY -= 20;
  
  // Draw issues detected
  if (aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin + 15,
      y: currentY,
      size: 10,
      font: italic,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 15;
    
    aiCondition.issuesDetected.slice(0, 2).forEach(issue => {
      page.drawText(`• ${issue}`, {
        x: margin + 25,
        y: currentY,
        size: 10,
        font: regular,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 12;
    });
    
    if (aiCondition.issuesDetected.length > 2) {
      page.drawText(`• And ${aiCondition.issuesDetected.length - 2} more...`, {
        x: margin + 25,
        y: currentY,
        size: 10,
        font: italic,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 12;
    }
  } else if (aiCondition.aiSummary) {
    // If no specific issues but there's a summary
    page.drawText('Analysis Notes:', {
      x: margin + 15,
      y: currentY,
      size: 10,
      font: italic,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 15;
    
    // Simple word wrapping for summary text
    const maxWidth = boxWidth - 40; // Left and right padding
    const words = aiCondition.aiSummary.split(' ');
    let line = '';
    let lineY = currentY;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = regular.widthOfTextAtSize(testLine, 10);
      
      if (testWidth > maxWidth) {
        page.drawText(line, {
          x: margin + 25,
          y: lineY,
          size: 10,
          font: regular,
          color: rgb(0.4, 0.4, 0.4),
        });
        lineY -= 12;
        line = word + ' ';
        
        // Check if we need more space
        if (lineY < boxY + 15) {
          break; // Stop if we run out of space in the box
        }
      } else {
        line = testLine;
      }
    }
    
    // Draw remaining text
    if (line.trim() !== '' && lineY >= boxY + 15) {
      page.drawText(line, {
        x: margin + 25,
        y: lineY,
        size: 10,
        font: regular,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
    
    currentY = lineY;
  }
  
  // Add AI Verified badge if confidence score is high enough
  if (confidenceScore >= 80) {
    const verifiedText = 'AI Verified';
    const textWidth = bold.widthOfTextAtSize(verifiedText, 10);
    const badgeWidth = textWidth + 20;
    const badgeHeight = 20;
    const badgeX = width - margin - badgeWidth;
    const badgeY = boxY + 10;
    
    // Draw badge background
    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: badgeWidth,
      height: badgeHeight,
      color: rgb(0.13, 0.7, 0.3), // Green
      borderColor: rgb(0.1, 0.6, 0.2),
      borderWidth: 1,
      opacity: 0.9,
    });
    
    // Draw badge text
    page.drawText(verifiedText, {
      x: badgeX + 10,
      y: badgeY + 6,
      size: 10,
      font: bold,
      color: rgb(1, 1, 1), // White
    });
  }
  
  return boxY - 10; // Adjust position after the box
}
