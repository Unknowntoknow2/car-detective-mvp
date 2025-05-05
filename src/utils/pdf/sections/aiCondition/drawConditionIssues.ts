
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draw condition issues or summary on the PDF
 */
export function drawConditionIssues(
  page: PDFPage,
  summary: string | undefined,
  issues: string[] | undefined,
  startY: number,
  margin: number,
  boxWidth: number,
  fonts: {
    regular: PDFFont;
    italic: PDFFont;
  }
): number {
  let currentY = startY;
  const { regular, italic } = fonts;
  
  // Draw summary if available
  if (summary) {
    const words = summary.split(' ');
    let line = '';
    let textY = currentY;
    
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const textWidth = regular.widthOfTextAtSize(testLine, 10);
      
      if (textWidth > boxWidth - 40) {
        page.drawText(line, {
          x: margin + 15,
          y: textY,
          size: 10,
          font: regular,
          color: rgb(0.3, 0.3, 0.3),
        });
        
        line = word;
        textY -= 15;
      } else {
        line = testLine;
      }
    }
    
    // Draw remaining line
    if (line) {
      page.drawText(line, {
        x: margin + 15,
        y: textY,
        size: 10,
        font: regular,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      currentY = textY - 20;
    }
  }
  
  // Draw issues if available
  if (issues && issues.length > 0) {
    page.drawText('Issues detected:', {
      x: margin + 15,
      y: currentY,
      size: 10,
      font: italic,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    currentY -= 15;
    
    for (const issue of issues) {
      page.drawText(`• ${issue}`, {
        x: margin + 20,
        y: currentY,
        size: 9,
        font: regular,
        color: rgb(0.4, 0.4, 0.4),
      });
      
      currentY -= 12;
    }
  }
  
  return currentY;
}
