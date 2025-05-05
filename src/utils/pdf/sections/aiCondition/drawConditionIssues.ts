
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draw condition issues or summary
 * Returns the new Y position after drawing
 */
export function drawConditionIssues(
  page: PDFPage,
  aiSummary?: string,
  issuesDetected?: string[],
  currentY: number,
  margin: number,
  boxWidth: number,
  fonts: {
    regular: PDFFont;
    italic: PDFFont;
  }
): number {
  const { regular, italic } = fonts;
  let yPos = currentY;
  
  // If there's a summary, display it
  if (aiSummary) {
    // Draw summary label
    page.drawText('AI Condition Summary:', {
      x: margin + 15,
      y: yPos,
      size: 12,
      font: regular,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPos -= 20;
    
    // Split summary into multiple lines if needed
    const summaryText = aiSummary.slice(0, 200); // Limit to 200 chars
    const words = summaryText.split(' ');
    let line = '';
    const maxWidth = boxWidth - 40; // Margins for text
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const textWidth = regular.widthOfTextAtSize(testLine, 10);
      
      if (textWidth > maxWidth && line) {
        page.drawText(line, {
          x: margin + 20,
          y: yPos,
          size: 10,
          font: italic,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPos -= 15;
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    
    // Draw remaining text
    if (line) {
      page.drawText(line, {
        x: margin + 20,
        y: yPos,
        size: 10,
        font: italic,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= 20;
    }
  }
  
  // If there are issues, list them
  if (issuesDetected && issuesDetected.length > 0) {
    // Draw issues label
    page.drawText('Issues Detected:', {
      x: margin + 15,
      y: yPos,
      size: 12,
      font: regular,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPos -= 20;
    
    // Draw each issue as a bullet point
    issuesDetected.slice(0, 3).forEach((issue) => { // Limit to 3 issues
      page.drawText(`• ${issue}`, {
        x: margin + 20,
        y: yPos,
        size: 10,
        font: regular,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= 15;
    });
    
    // If there are more issues than shown
    if (issuesDetected.length > 3) {
      page.drawText(`• ${issuesDetected.length - 3} more issues...`, {
        x: margin + 20,
        y: yPos,
        size: 10,
        font: italic,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPos -= 15;
    }
  }
  
  return yPos;
}
