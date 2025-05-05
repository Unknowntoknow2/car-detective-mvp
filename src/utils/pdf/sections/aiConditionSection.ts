
import { PDFPage, rgb, PDFFont } from 'pdf-lib';
import { drawConditionBox } from './aiCondition/drawConditionBox';
import { drawConditionTitle } from './aiCondition/drawConditionTitle';
import { drawVerificationBadge } from './aiCondition/drawVerificationBadge';
import { drawConditionIssues } from './aiCondition/drawConditionIssues';

interface AiConditionData {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

interface DrawAiConditionParams {
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
 * Draw AI condition assessment section
 * Returns the new Y position after drawing
 */
export function drawAIConditionSection(
  aiCondition: AiConditionData,
  params: DrawAiConditionParams
): number {
  const { page, yPosition, margin, width, fonts } = params;
  
  // Skip if no condition data
  if (!aiCondition || !aiCondition.condition) {
    return yPosition;
  }
  
  let currentY = yPosition - 20;
  
  // Draw section title
  page.drawText('AI Vehicle Condition Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: fonts.bold,
    color: rgb(0.2, 0.2, 0.6)
  });
  currentY -= 25;
  
  // Get condition color based on condition level
  const conditionColor = getConditionColor(aiCondition.condition);
  
  // Create a condition box
  const boxHeight = 150;
  const boxWidth = width - (margin * 2);
  
  // Draw the container box
  drawConditionBox(
    page,
    aiCondition.condition,
    currentY - boxHeight + 15,
    boxWidth,
    boxHeight,
    margin,
    conditionColor
  );
  
  // Draw the condition title
  drawConditionTitle(
    page,
    aiCondition.condition,
    currentY - 10,
    margin + 20,
    fonts.bold,
    conditionColor
  );
  
  // Draw verification badge if confidence is high enough
  drawVerificationBadge(
    page,
    aiCondition.confidenceScore,
    currentY - boxHeight + 15,
    width,
    margin,
    fonts.bold
  );
  
  // Draw detected issues and summary
  drawConditionIssues(
    page,
    currentY - 45,
    margin,
    boxWidth,
    { regular: fonts.regular, italic: fonts.italic },
    aiCondition.aiSummary,
    aiCondition.issuesDetected
  );
  
  return currentY - boxHeight - 10;
}

/**
 * Get the color for a condition level
 */
function getConditionColor(condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null) {
  switch (condition) {
    case 'Excellent':
      return rgb(0, 0.7, 0.3); // Green
    case 'Good':
      return rgb(0.2, 0.5, 0.8); // Blue
    case 'Fair':
      return rgb(0.9, 0.6, 0.1); // Orange
    case 'Poor':
      return rgb(0.8, 0.2, 0.2); // Red
    default:
      return rgb(0.5, 0.5, 0.5); // Gray
  }
}
