
import { PDFPage, rgb, PDFFont } from 'pdf-lib';
import { wrapText } from '../../helpers/textUtils';

/**
 * Draws the issues detected or AI summary text
 * Returns the updated y position
 */
export function drawConditionIssues(
  page: PDFPage,
  aiSummary: string | undefined,
  issuesDetected: string[] | undefined,
  startY: number,
  margin: number,
  maxWidth: number,
  fonts: {
    regular: PDFFont,
    italic: PDFFont
  }
): number {
  let currentY = startY;
  const { regular, italic } = fonts;
  
  if (issuesDetected && issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin + 15,
      y: currentY,
      size: 10,
      font: italic,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 15;
    
    issuesDetected.slice(0, 2).forEach(issue => {
      page.drawText(`• ${issue}`, {
        x: margin + 25,
        y: currentY,
        size: 10,
        font: regular,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 12;
    });
    
    if (issuesDetected.length > 2) {
      page.drawText(`• And ${issuesDetected.length - 2} more...`, {
        x: margin + 25,
        y: currentY,
        size: 10,
        font: italic,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 12;
    }
  } else if (aiSummary) {
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
    const boxWidth = maxWidth - 40; // Left and right padding
    const words = aiSummary.split(' ');
    let line = '';
    let lineY = currentY;
    const minY = lineY - 60; // Prevent too many lines
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = regular.widthOfTextAtSize(testLine, 10);
      
      if (testWidth > boxWidth) {
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
        if (lineY < minY) {
          break; // Stop if we run out of space in the box
        }
      } else {
        line = testLine;
      }
    }
    
    // Draw remaining text
    if (line.trim() !== '' && lineY >= minY) {
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
  
  return currentY;
}
