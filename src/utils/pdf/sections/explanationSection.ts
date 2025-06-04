<<<<<<< HEAD

import { SectionParams } from '../types';

export function drawExplanationSection(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  if (!options.includeExplanation || !data.explanation) {
    return y; // Skip if explanation is not to be included
  }
  
=======
import { rgb } from "pdf-lib";
import { SectionParams } from "../types";

/**
 * Draws the explanation section of the PDF
 */
export function drawExplanationSection(
  params: SectionParams,
  explanation: string,
  yPosition: number,
): number {
  const { page, margin, regularFont, boldFont, contentWidth = 512 } = params;
  const sectionTitle = "Valuation Explanation";

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  // Draw section title
  page.drawText('Valuation Explanation', {
    x: margin,
<<<<<<< HEAD
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 15;
  
  // Split explanation into multiple lines for better readability
  const maxWidth = width - (margin * 2);
  const explanationText = data.explanation || '';
  const words = explanationText.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = fonts.regular.widthOfTextAtSize(testLine, 9);
    
    if (textWidth > maxWidth) {
      // Draw the current line and move to next line
      page.drawText(currentLine, {
        x: margin,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      y -= 12;
=======
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  yPosition -= 25;

  // Break the explanation text into multiple lines
  const fontSize = 10;
  const lineHeight = 14;
  const maxWidth = contentWidth;
  const words = explanation.split(" ");
  let currentLine = "";
  let linesCount = 0;

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testLineWidth = regularFont.widthOfTextAtSize(testLine, fontSize);

    if (testLineWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      // Draw the current line and start a new one
      page.drawText(currentLine, {
        x: margin,
        y: yPosition - (linesCount * lineHeight),
        size: fontSize,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      linesCount++;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
<<<<<<< HEAD
  
  // Draw the last line if there's anything left
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 20;
  }
  
  return y; // Return the new Y position
=======

  // Draw the last line
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y: yPosition - (linesCount * lineHeight),
      size: fontSize,
      font: regularFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    linesCount++;
  }

  // Return the new vertical position after the explanation section
  return yPosition - (linesCount * lineHeight) - 20;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
