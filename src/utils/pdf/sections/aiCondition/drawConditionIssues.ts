
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

interface IssuesFonts {
  regular: PDFFont;
  italic: PDFFont;
}

/**
 * Draw the detected issues or summary
 * Returns the new Y position after drawing
 */
export function drawConditionIssues(
  page: PDFPage,
  yPosition: number,
  margin: number,
  boxWidth: number,
  fonts: IssuesFonts,
  aiSummary?: string,
  issuesDetected?: string[]
): number {
  let currentY = yPosition;
  
  // If we have a summary, display it
  if (aiSummary) {
    const summaryLines = wrapText(aiSummary, fonts.italic, 11, boxWidth - 40);
    
    for (const line of summaryLines) {
      page.drawText(line, {
        x: margin + 15,
        y: currentY,
        size: 11,
        font: fonts.italic,
        color: rgb(0.3, 0.3, 0.3)
      });
      currentY -= 16;
    }
  }
  
  // If we have detected issues, list them
  if (issuesDetected && issuesDetected.length > 0) {
    currentY -= 10;
    
    page.drawText('Issues Detected:', {
      x: margin + 15,
      y: currentY,
      size: 11,
      font: fonts.regular,
      color: rgb(0.6, 0.1, 0.1)
    });
    currentY -= 20;
    
    for (const issue of issuesDetected) {
      page.drawText(`• ${issue}`, {
        x: margin + 20,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: rgb(0.4, 0.4, 0.4)
      });
      currentY -= 14;
    }
  }
  
  return currentY;
}

/**
 * Utility to wrap text based on available width
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
