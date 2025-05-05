
import { PDFPage, rgb } from 'pdf-lib';
import { PdfFonts, PdfConstants } from '../components/pdfCommon';
import { wrapText } from '../helpers/textUtils';

/**
 * Draw expert valuation commentary section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawCommentarySection(
  page: PDFPage,
  explanation: string,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, width, headingFontSize, normalFontSize, smallFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Commentary section header
  page.drawText('Expert Valuation Commentary', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: boldFont,
    color: rgb(0, 0, 0.8)
  });
  
  // Draw a light gray background for the commentary
  yPos -= 10;
  const commentaryText = explanation || "This valuation explanation is currently unavailable. Please contact support.";
  const commentaryLines = wrapText(commentaryText, regularFont, normalFontSize, width - (margin * 2));
  const commentaryHeight = commentaryLines.length * 16 + 20; // Height of all lines plus padding
  
  // Draw background rectangle
  page.drawRectangle({
    x: margin - 10,
    y: yPos - commentaryHeight + 10,
    width: width - (margin * 2) + 20,
    height: commentaryHeight,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  // Format and wrap the explanation text
  yPos -= 15;
  
  for (const line of commentaryLines) {
    page.drawText(line, {
      x: margin,
      y: yPos,
      size: normalFontSize,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    
    yPos -= 16;
  }
  
  // Add powered by note
  yPos -= 15;
  page.drawText('Powered by GPT-4o | CarDetective AI', {
    x: margin,
    y: yPos,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  return yPos;
}
