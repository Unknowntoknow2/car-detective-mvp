
import { ReportData, SectionParams } from '../types';

export function drawPhotoAssessmentSection(
  params: SectionParams, 
  reportData: ReportData, 
  yPosition: number
): number {
  const { page, regularFont, boldFont, margin, contentWidth } = params;
  
  // If no photo data, skip this section
  if (!reportData.bestPhotoUrl && !reportData.photoScore) {
    return yPosition;
  }
  
  // Header
  page.drawText('Photo Assessment', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: { r: 0.1, g: 0.1, b: 0.1 }
  });
  yPosition -= 25;

  // Draw photo score if available
  if (reportData.photoScore) {
    page.drawText('Photo Quality Score:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: { r: 0.3, g: 0.3, b: 0.3 }
    });
    
    const score = `${Math.round(reportData.photoScore)}%`;
    page.drawText(score, {
      x: margin + 150,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: { r: 0.2, g: 0.6, b: 0.2 }
    });
    yPosition -= 20;
  }
  
  // Draw AI condition if available
  if (reportData.aiCondition) {
    page.drawText('AI-Detected Condition:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: { r: 0.3, g: 0.3, b: 0.3 }
    });
    
    page.drawText(reportData.aiCondition.condition, {
      x: margin + 150,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: { r: 0.2, g: 0.6, b: 0.2 }
    });
    yPosition -= 20;
    
    // Add confidence score
    page.drawText('Confidence:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: { r: 0.3, g: 0.3, b: 0.3 }
    });
    
    page.drawText(`${Math.round(reportData.aiCondition.confidenceScore)}%`, {
      x: margin + 150,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: { r: 0.2, g: 0.6, b: 0.2 }
    });
    yPosition -= 20;
  }
  
  // Draw explanation if available
  if (reportData.explanation) {
    page.drawText('Photo Analysis:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: { r: 0.3, g: 0.3, b: 0.3 }
    });
    yPosition -= 20;
    
    // Wrap text to fit
    const explanation = reportData.explanation;
    const words = explanation.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const lineWidth = regularFont.widthOfTextAtSize(testLine, 12);
      
      if (lineWidth > contentWidth) {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 12,
          font: regularFont,
          color: { r: 0.3, g: 0.3, b: 0.3 }
        });
        yPosition -= 15;
        line = word;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: { r: 0.3, g: 0.3, b: 0.3 }
      });
      yPosition -= 20;
    }
  }
  
  return yPosition;
}
