<<<<<<< HEAD

import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawPhotoAssessmentSection(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  if (!options.includePhotoAssessment || !data.aiCondition) {
    return y; // Skip if photo assessment is not to be included
=======
import { Color, PDFFont, PDFPage, rgb } from "pdf-lib";
import { ReportData, SectionParams } from "../types";

export const drawPhotoAssessmentSection = (
  params: SectionParams,
  reportData: ReportData,
): number => {
  const {
    page,
    y,
    margin,
    contentWidth,
    regularFont,
    boldFont,
    textColor,
    primaryColor,
  } = params;
  let currentY = y - 20;

  // Check if we have a photo URL and/or photo score to display
  if (
    !reportData.bestPhotoUrl && !reportData.photoScore &&
    !reportData.aiCondition
  ) {
    return currentY;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }

  // Draw section title
<<<<<<< HEAD
  page.drawText('Photo Assessment', {
=======
  page.drawText("Visual Assessment", {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    x: margin,
    y,
    size: 14,
<<<<<<< HEAD
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw condition assessment
  if (data.aiCondition.condition) {
    page.drawText('Condition Assessment:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(data.aiCondition.condition, {
      x: margin + 150,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  }
  
  // Draw confidence score if available
  if (data.aiCondition.confidenceScore) {
    page.drawText('Assessment Confidence:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(`${data.aiCondition.confidenceScore}%`, {
      x: margin + 150,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 20;
  }
  
  // Draw issues detected if available
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    y -= 15;
    
    // List all issues
    for (const issue of data.aiCondition.issuesDetected) {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      y -= 12;
    }
    
    y -= 5;
  }
  
  // Draw summary if available
  if (data.aiCondition.summary) {
    page.drawText('Summary:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    y -= 15;
    
    // Split summary into multiple lines
    const maxWidth = width - (margin * 2) - 10; // Slight indent
    const words = data.aiCondition.summary.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = fonts.regular.widthOfTextAtSize(testLine, 9);
      
      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: margin + 10,
          y,
          size: 9,
          font: fonts.regular,
          color: textColor,
        });
        
        y -= 12;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    // Draw the last line if there's anything left
    if (currentLine) {
      page.drawText(currentLine, {
        x: margin + 10,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      y -= 20;
    }
  }
  
  return y; // Return the new Y position
}
=======
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY -= 30;

  // If we have a photo score, display it
  if (reportData.photoScore) {
    // Draw photo score label
    page.drawText("Photo Quality Score:", {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Calculate color based on score
    const score = reportData.photoScore;
    const scoreColor = score > 80
      ? rgb(0.2, 0.7, 0.3)
      : score > 60
      ? rgb(0.9, 0.6, 0.2)
      : rgb(0.8, 0.2, 0.2);

    // Draw score
    page.drawText(`${score}%`, {
      x: margin + 140,
      y: currentY,
      size: 11,
      font: boldFont,
      color: scoreColor,
    });

    currentY -= 20;
  }

  // If we have AI condition data, display it
  if (reportData.aiCondition) {
    // Draw condition label
    page.drawText("Condition Assessment:", {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Draw condition value
    page.drawText(reportData.aiCondition.condition, {
      x: margin + 140,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.5, 0.7),
    });

    currentY -= 20;

    // Draw confidence label
    page.drawText("Confidence:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Draw confidence value
    page.drawText(`${reportData.aiCondition.confidenceScore}%`, {
      x: margin + 140,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    currentY -= 30;
  }

  // If we have issues detected, display them
  if (
    reportData.aiCondition?.issuesDetected &&
    reportData.aiCondition.issuesDetected.length > 0
  ) {
    // Draw issues label
    page.drawText("Issues Detected:", {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    currentY -= 20;

    // Draw each issue
    reportData.aiCondition.issuesDetected.forEach((issue, index) => {
      // Draw bullet point
      page.drawText("•", {
        x: margin + 10,
        y: currentY,
        size: 11,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Draw issue text
      page.drawText(issue, {
        x: margin + 25,
        y: currentY,
        size: 10,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3),
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
    const wrapText = (
      text: string,
      maxWidth: number,
      fontSize: number,
      font: PDFFont,
    ): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const width = font.widthOfTextAtSize(
          `${currentLine} ${word}`.trim(),
          fontSize,
        );

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
    page.drawText("AI Assessment:", {
      x: margin,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    currentY -= 20;

    // Draw wrapped summary text
    const lines = wrapText(summary, maxWidth, fontSize, regularFont);

    lines.forEach((line) => {
      page.drawText(line, {
        x: margin + 10,
        y: currentY,
        size: fontSize,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      currentY -= lineHeight;
    });
  }

  return currentY - 10; // Add a bit of extra padding at the bottom
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
