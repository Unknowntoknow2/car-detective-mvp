
import { PDFPage, rgb, PDFFont } from 'pdf-lib';
import { getConditionColor } from './conditionColorUtil';
import { drawConditionBox } from './drawConditionBox';
import { drawVerificationBadge } from './drawVerificationBadge';
import { drawConditionIssues } from './drawConditionIssues';

export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface DrawAIConditionOptions {
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
  
  // Get the color based on condition
  const conditionColor = getConditionColor(aiCondition.condition);
  const confidenceScore = aiCondition.confidenceScore || 0;
  
  // Draw title with brain emoji
  page.drawText('🧠 AI Vehicle Condition Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: bold,
    color: primaryColor,
  });
  currentY -= 25;
  
  // Configure the box dimensions
  const boxWidth = width - (margin * 2);
  const boxHeight = 100;  // Adjust based on content
  const boxY = currentY - boxHeight + 15;
  
  // Draw the condition box
  drawConditionBox(page, aiCondition.condition, boxY, boxWidth, boxHeight, margin, conditionColor);
  
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
  
  // Draw issues or summary
  currentY = drawConditionIssues(
    page,
    currentY,
    margin,
    boxWidth,
    { regular, italic },
    aiCondition.aiSummary,
    aiCondition.issuesDetected
  );
  
  // Add verification badge if confidence is high enough
  drawVerificationBadge(page, confidenceScore, boxY, width, margin, bold);
  
  return boxY - 10; // Adjust position after the box
}
