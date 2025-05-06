import { PDFPage, rgb, PDFFont, Color } from 'pdf-lib';

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
  }
}

/**
 * Draws the AI condition assessment section on a PDF page
 * Returns the new Y position after drawing
 */
export function drawAIConditionSection(
  aiCondition: AICondition,
  options: DrawAIConditionOptions
): number {
  const { page, yPosition, margin, width, fonts } = options;
  
  if (!aiCondition || !aiCondition.condition) {
    return yPosition;
  }
  
  const boxWidth = width - (margin * 2);
  let y = yPosition;
  
  // Draw section title
  page.drawText('AI Condition Assessment', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: rgb(0.12, 0.46, 0.70)
  });
  y -= 20;
  
  // Draw condition badge
  const conditionColor = getConditionColor(aiCondition.condition);
  
  // Draw a background for the condition
  page.drawRectangle({
    x: margin,
    y: y - 14,
    width: 120,
    height: 22,
    color: conditionColor.light,
    borderColor: conditionColor.border,
    borderWidth: 1,
    opacity: 0.8,
    borderOpacity: 1
  });
  
  // Draw condition text
  page.drawText(`${aiCondition.condition} Condition`, {
    x: margin + 10,
    y: y - 10,
    size: 12,
    font: fonts.bold,
    color: conditionColor.text
  });
  
  // Draw confidence score
  page.drawText(`${aiCondition.confidenceScore}% confidence`, {
    x: margin + 140,
    y: y - 10,
    size: 10,
    font: fonts.regular,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw AI verified badge
  const badgeText = "AI VERIFIED";
  const badgeWidth = fonts.bold.widthOfTextAtSize(badgeText, 8) + 14;
  
  page.drawRectangle({
    x: width - margin - badgeWidth,
    y: y - 14,
    width: badgeWidth,
    height: 22,
    color: rgb(0.9, 0.95, 1),
    borderColor: rgb(0.4, 0.6, 0.9),
    borderWidth: 1,
    opacity: 0.8,
    borderOpacity: 1
  });
  
  page.drawText(badgeText, {
    x: width - margin - badgeWidth + 7,
    y: y - 10,
    size: 8,
    font: fonts.bold,
    color: rgb(0.2, 0.4, 0.8)
  });
  
  y -= 30;
  
  // Draw summary and issues
  if (aiCondition.aiSummary) {
    // Draw a light background for the summary
    page.drawRectangle({
      x: margin,
      y: y - 45,
      width: boxWidth,
      height: 55,
      color: rgb(0.97, 0.97, 0.98),
      borderColor: rgb(0.9, 0.9, 0.92),
      borderWidth: 1
    });
    
    // Draw summary text
    page.drawText("AI Summary:", {
      x: margin + 10,
      y: y - 15,
      size: 10,
      font: fonts.bold,
      color: rgb(0.4, 0.4, 0.6)
    });
    
    // Draw the actual summary text with word wrapping
    // This is simplified; in a production environment, you would implement proper text wrapping
    page.drawText(aiCondition.aiSummary.substring(0, 100) + (aiCondition.aiSummary.length > 100 ? "..." : ""), {
      x: margin + 10,
      y: y - 35,
      size: 9,
      font: fonts.italic,
      color: rgb(0.3, 0.3, 0.4)
    });
    
    y -= 65;
  }
  
  // Draw issues if any
  if (aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
    page.drawText("Issues Detected:", {
      x: margin,
      y: y,
      size: 10,
      font: fonts.bold,
      color: rgb(0.7, 0.3, 0.3)
    });
    y -= 15;
    
    // Draw each issue as a bullet point
    for (let i = 0; i < Math.min(5, aiCondition.issuesDetected.length); i++) {
      const issue = aiCondition.issuesDetected[i];
      
      page.drawText("•", {
        x: margin,
        y,
        size: 10,
        font: fonts.bold,
        color: rgb(0.7, 0.3, 0.3)
      });
      
      page.drawText(issue, {
        x: margin + 15,
        y,
        size: 9,
        font: fonts.regular,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      y -= 15;
    }
    
    // If there are more issues than we can show
    if (aiCondition.issuesDetected.length > 5) {
      page.drawText(`+${aiCondition.issuesDetected.length - 5} more issues...`, {
        x: margin + 15,
        y,
        size: 9,
        font: fonts.italic,
        color: rgb(0.5, 0.5, 0.5)
      });
      y -= 15;
    }
  }
  
  return y - 10;
}

/**
 * Gets the appropriate colors for a condition level
 */
function getConditionColor(condition: string) {
  switch (condition) {
    case 'Excellent':
      return {
        light: rgb(0.85, 0.95, 0.85),
        border: rgb(0.6, 0.8, 0.6),
        text: rgb(0.2, 0.6, 0.2)
      };
    case 'Good':
      return {
        light: rgb(0.9, 0.95, 0.8),
        border: rgb(0.7, 0.8, 0.5),
        text: rgb(0.5, 0.6, 0.1)
      };
    case 'Fair':
      return {
        light: rgb(0.97, 0.93, 0.8),
        border: rgb(0.8, 0.7, 0.5),
        text: rgb(0.7, 0.5, 0.1)
      };
    case 'Poor':
      return {
        light: rgb(0.97, 0.85, 0.85),
        border: rgb(0.8, 0.6, 0.6),
        text: rgb(0.7, 0.2, 0.2)
      };
    default:
      return {
        light: rgb(0.9, 0.9, 0.9),
        border: rgb(0.7, 0.7, 0.7),
        text: rgb(0.4, 0.4, 0.4)
      };
  }
}
