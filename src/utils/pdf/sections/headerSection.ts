<<<<<<< HEAD

import { SectionParams } from '../types';

export function drawHeaderSection(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y,
    size: 16,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw generated date if available
  if (data.generatedAt) {
    const date = new Date(data.generatedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    page.drawText(`Generated: ${formattedDate}`, {
      x: margin,
      y,
      size: 8,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 20;
  }
  
  return y; // Return the new Y position
=======
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";

interface HeaderSectionProps {
  yPosition: number;
  width: number;
  margin: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  includeBranding?: boolean;
}

/**
 * Draws the header section of the valuation report
 * @returns The new vertical position after drawing the header
 */
export async function drawHeaderSection(
  pdfDoc: PDFDocument,
  page: PDFPage,
  props: HeaderSectionProps,
): Promise<number> {
  const {
    yPosition,
    width,
    margin,
    regularFont,
    boldFont,
    includeBranding = true,
  } = props;
  let currentY = yPosition;

  // Add title
  page.drawText("VEHICLE VALUATION REPORT", {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY -= 20;

  // Add subtitle with date
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  page.drawText(`Generated on ${dateStr}`, {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  currentY -= 30;

  // Draw a line to separate the header from the content
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  currentY -= 20;

  return currentY;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
