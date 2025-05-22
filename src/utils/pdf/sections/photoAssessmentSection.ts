
import { SectionParams } from '../types';

export const drawPhotoAssessmentSection = (params: SectionParams): number => {
  const { 
    data, 
    y, 
    page, 
    contentWidth = 500, 
    regularFont, 
    boldFont, 
    textColor = { r: 0, g: 0, b: 0 },
    doc
  } = params;
  
  // Get the photo URL
  const photoUrl = data.photoUrl || data.bestPhotoUrl;
  const photoScore = data.photoScore || 0;
  
  let currentY = y - 30;
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: 50,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor,
  });
  
  currentY -= 30;
  
  // If we have a photo, embed it
  if (photoUrl) {
    // In a real implementation, we would fetch and embed the image
    // But for now, we'll just add a placeholder text
    page.drawText('Vehicle Photo (URL: ' + photoUrl.substring(0, 30) + '...)', {
      x: 50,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    
    currentY -= 20;
    
    // Draw a placeholder rectangle for the image
    page.drawRectangle({
      x: 50,
      y: currentY - 150,
      width: 200,
      height: 150,
      borderWidth: 1,
      borderColor: textColor,
    });
    
    currentY -= 170;
  }
  
  // Draw the photo score if available
  if (photoScore) {
    page.drawText(`Photo Quality Score: ${photoScore}/10`, {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Draw AI condition assessment if available
  if (data.aiCondition) {
    const aiCondition = data.aiCondition;
    
    page.drawText('AI Condition Assessment:', {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 20;
    
    // Summary
    if (typeof aiCondition === 'object' && aiCondition.summary) {
      page.drawText('Summary:', {
        x: 60,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      page.drawText(aiCondition.summary.substring(0, 80), {
        x: 130,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      
      currentY -= 20;
    } else if (typeof aiCondition === 'string') {
      page.drawText('Summary:', {
        x: 60,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      page.drawText(aiCondition.substring(0, 80), {
        x: 130,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      
      currentY -= 20;
    }
    
    // Confidence score
    if (typeof aiCondition === 'object' && aiCondition.confidenceScore) {
      page.drawText('Confidence:', {
        x: 60,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      page.drawText(`${aiCondition.confidenceScore}%`, {
        x: 130,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      
      currentY -= 20;
    }
    
    // Issues detected
    if (typeof aiCondition === 'object' && aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: 60,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      currentY -= 20;
      
      for (let i = 0; i < Math.min(3, aiCondition.issuesDetected.length); i++) {
        page.drawText(`• ${aiCondition.issuesDetected[i]}`, {
          x: 70,
          y: currentY,
          size: 10,
          font: regularFont,
          color: textColor,
        });
        
        currentY -= 15;
      }
    }
  }
  
  return currentY;
};
