
import { PDFPage, PDFFont, Color, rgb } from 'pdf-lib';
import { ReportData, SectionParams } from '../types';

export const drawPhotoAssessmentSection = (
  params: SectionParams,
  reportData: ReportData
): number => {
  const { page, y, margin, contentWidth, regularFont, boldFont, textColor, primaryColor } = params;
  let currentY = y - 20;
  
  // Check if we have a photo URL and/or photo score to display
  if (!reportData.bestPhotoUrl && !reportData.photoScore && !reportData.aiCondition) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Visual Assessment', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 30;
  
  // If we have a photo score, display it
  if (reportData.photoScore) {
    // Draw photo score label
    page.drawText('Photo Quality Score:', {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Calculate color based on score
    const score = reportData.photoScore;
    const scoreColor = score > 80 ? rgb(0.2, 0.7, 0.3) : 
                      score > 60 ? rgb(0.9, 0.6, 0.2) : 
                      rgb(0.8, 0.2, 0.2);
    
    // Draw score
    page.drawText(`${score}%`, {
      x: margin + 140,
      y: currentY,
      size: 11,
      font: boldFont,
      color: scoreColor
    });
    
    currentY -= 20;
  }
  
  // If we have AI condition data, display it
  if (reportData.aiCondition) {
    // Draw condition label
    page.drawText('Condition Assessment:', {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Draw condition value
    page.drawText(reportData.aiCondition.condition, {
      x: margin + 140,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.5, 0.7)
    });
    
    currentY -= 20;
    
    // Draw confidence label
    page.drawText('Confidence:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Draw confidence value
    page.drawText(`${reportData.aiCondition.confidenceScore}%`, {
      x: margin + 140,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    currentY -= 30;
  }
  
  // If we have issues detected, display them
  if (reportData.aiCondition?.issuesDetected && reportData.aiCondition.issuesDetected.length > 0) {
    // Draw issues label
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    currentY -= 20;
    
    // Draw each issue
    reportData.aiCondition.issuesDetected.forEach((issue, index) => {
      // Draw bullet point
      page.drawText('•', {
        x: margin + 10,
        y: currentY,
        size: 11,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      // Draw issue text
      page.drawText(issue, {
        x: margin + 25,
        y: currentY,
        size: 10,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      currentY -= 15;
    });
    
    currentY -= 10;
  }
  
  // If we have a summary, display it
  if (reportData.aiCondition?.summary) {
    const summary = reportData.aiCondition.summary;
    const maxWidth = contentWidth - 40;
    const fontSize = 10;
    const lineHeight = 15;
    
    // Function to word wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number, font: PDFFont): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const width = font.widthOfTextAtSize(`${currentLine} ${word}`.trim(), fontSize);
        
        if (width < maxWidth) {
          currentLine = `${currentLine} ${word}`.trim();
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    };
    
    // Draw summary label
    page.drawText('AI Assessment:', {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    currentY -= 20;
    
    // Draw wrapped summary text
    const lines = wrapText(summary, maxWidth, fontSize, regularFont);
    
    lines.forEach(line => {
      page.drawText(line, {
        x: margin + 10,
        y: currentY,
        size: fontSize,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      currentY -= lineHeight;
    });
  }
  
  return currentY - 10; // Add a bit of extra padding at the bottom
};
