
import { SectionParams } from '../types';

export function drawPhotoAssessmentSection(params: SectionParams): number {
  const { data, page, y, width = 500, margin = 50, regularFont, boldFont, textColor, doc } = params;
  
  // Exit early if no photo data
  const photoUrl = data.photoUrl || data.bestPhotoUrl;
  const photoScore = data.photoScore;
  if (!photoUrl && !photoScore && !data.aiCondition) {
    return y;
  }
  
  let currentY = y;
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 30;
  
  // Draw photo if available
  if (photoUrl) {
    // Logic to embed an image would go here
    // For now, just add placeholder text
    page.drawText('Photo available: ' + photoUrl, {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor
    });
    currentY -= 20;
  }
  
  // Draw photo score if available
  if (photoScore !== undefined) {
    page.drawText(`Photo Score: ${(photoScore * 100).toFixed(0)}%`, {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    // Add explanation of score
    const scoreText = getScoreDescription(photoScore);
    page.drawText(scoreText, {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor
    });
    currentY -= 30;
  }
  
  // Draw AI condition assessment if available
  if (data.aiCondition) {
    const aiCondition = data.aiCondition;
    
    // Helper function to check if aiCondition is an object
    const isAiConditionObject = (obj: any): obj is { 
      summary?: string; 
      score?: number; 
      confidenceScore?: number; 
      issuesDetected?: string[];
      condition?: string;
    } => {
      return typeof obj === 'object' && obj !== null;
    };
    
    // Draw condition summary
    page.drawText('AI Condition Assessment:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    // Draw summary if available
    if (isAiConditionObject(aiCondition) && aiCondition.summary) {
      page.drawText(aiCondition.summary, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    } else if (typeof aiCondition === 'string') {
      page.drawText(aiCondition, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    }
    
    // Draw confidence score if available
    if (isAiConditionObject(aiCondition) && aiCondition.confidenceScore) {
      page.drawText('Confidence Score:', {
        x: margin,
        y: currentY,
        size: 11,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;
      
      page.drawText(`${aiCondition.confidenceScore.toFixed(0)}%`, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    }
    
    // Draw issues detected if available
    if (isAiConditionObject(aiCondition) && aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: currentY,
        size: 11,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;
      
      // List all issues
      for (const issue of aiCondition.issuesDetected) {
        page.drawText(`• ${issue}`, {
          x: margin + 10,
          y: currentY,
          size: 10,
          font: regularFont,
          color: textColor
        });
        currentY -= 15;
      }
    }
  }
  
  return currentY;
}

function getScoreDescription(score: number): string {
  if (score >= 0.9) {
    return 'Excellent: Photos show a vehicle in exceptional condition.';
  } else if (score >= 0.8) {
    return 'Very Good: Photos show a well-maintained vehicle with minimal wear.';
  } else if (score >= 0.7) {
    return 'Good: Photos show a vehicle in good condition with normal wear.';
  } else if (score >= 0.6) {
    return 'Fair: Photos show a vehicle with noticeable wear and potential issues.';
  } else {
    return 'Poor: Photos show a vehicle with significant wear or potential problems.';
  }
}
