<<<<<<< HEAD

import { rgb, Color } from 'pdf-lib';
import { SectionParams } from '../types';

export async function addAdjustmentTable(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY - 300;
  const textColor = params.textColor || rgb(0.1, 0.1, 0.1);
  
  // Draw section title
  page.drawText('Adjustment Factors', {
    x: margin,
    y,
    size: 18,
    font: fonts.bold,
    color: textColor,
=======
// Fixed import for formatCurrency from the correct module path
import { formatCurrency } from "@/utils/formatters";
import { AdjustmentBreakdown, SectionParams } from "../types";

export const drawAdjustmentTable = (
  params: SectionParams,
  adjustments: AdjustmentBreakdown[],
): number => {
  const {
    page,
    y,
    width,
    margin,
    boldFont,
    regularFont,
    primaryColor,
    textColor,
  } = params;
  const tableX = margin || 72; // Default margin if not provided
  let currentY = y;
  const rowHeight = 20;
  const numColumns = 3;
  const columnWidths = [
    (width || 500) * 0.4,
    (width || 500) * 0.3,
    (width || 500) * 0.3,
  ]; // Adjusted for 3 columns
  const headers = ["Factor", "Description", "Impact"];

  // Function to draw a cell with text wrapping
  const drawTableCell = (
    page: any,
    text: string,
    x: number,
    y: number,
    colWidth: number,
    font: any,
    fontSize: number,
    color: any,
    alignment: "left" | "center" | "right" = "left",
  ) => {
    const words = text.split(" ");
    let line = "";
    let yOffset = y;

    words.forEach((word, index) => {
      const testLine = line + word + " ";
      const textWidth = font?.widthOfTextAtSize
        ? font.widthOfTextAtSize(testLine, fontSize)
        : testLine.length * fontSize * 0.6;

      if (textWidth > colWidth && line !== "") {
        // Draw the line
        page.drawText(line.trim(), {
          x: x,
          y: yOffset,
          font: font,
          size: fontSize,
          color: color,
          wordBreaks: ["break-word"],
        });
        yOffset -= fontSize * 1.2; // Adjust line spacing
        line = word + " ";
      } else {
        line = testLine;
      }

      if (index === words.length - 1) {
        // Draw the last line
        page.drawText(line.trim(), {
          x: x,
          y: yOffset,
          font: font,
          size: fontSize,
          color: color,
          wordBreaks: ["break-word"],
        });
      }
    });

    return yOffset; // Return the new Y offset after drawing the cell
  };

  // Check if page is available before drawing
  if (!page) {
    console.error("Page object is missing in SectionParams");
    return currentY;
  }

  // Draw table headers
  for (let i = 0; i < numColumns; i++) {
    page.drawText(headers[i], {
      x: tableX + columnWidths[0] * i,
      y: currentY,
      font: boldFont,
      size: 10,
      color: primaryColor,
    });
  }
  currentY -= rowHeight;

  // Draw table rows
  adjustments.forEach((adjustment) => {
    let cellY = currentY; // Start the cell's Y position at the current row Y

    // Draw Factor cell
    const factorY = drawTableCell(
      page,
      adjustment.factor,
      tableX,
      cellY,
      columnWidths[0],
      regularFont,
      10,
      textColor,
    );

    // Draw Description cell
    const descriptionY = drawTableCell(
      page,
      adjustment.description || "N/A",
      tableX + columnWidths[0],
      cellY,
      columnWidths[1],
      regularFont,
      10,
      textColor,
    );

    // Draw Impact cell
    const impactText = formatCurrency(adjustment.impact);
    const impactY = drawTableCell(
      page,
      impactText,
      tableX + columnWidths[0] + columnWidths[1],
      cellY,
      columnWidths[2],
      regularFont,
      10,
      textColor,
      "right",
    );

    // Determine the lowest Y value after drawing all cells in the row
    const lowestY = Math.min(factorY, descriptionY, impactY);

    // Update currentY to the lowest Y value minus some padding
    currentY = lowestY - 5;

    // Draw row separator
    page.drawLine({
      start: { x: tableX, y: currentY + 3 },
      end: { x: tableX + (width || 500), y: currentY + 3 },
      color: primaryColor,
      thickness: 0.5,
    });
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
  
  // Table header Y position
  let currentY = y - 40;
  
  // Column widths
  const factorWidth = 150;
  const impactWidth = 100;
  const descriptionWidth = pageWidth - margin * 2 - factorWidth - impactWidth;
  
  // Draw table header
  page.drawText('Factor', {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + factorWidth,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + factorWidth + impactWidth,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  // Draw line under header
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: pageWidth - margin, y: currentY - 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 30;
  
  // Draw adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    for (const adjustment of data.adjustments) {
      // Draw factor
      page.drawText(adjustment.factor, {
        x: margin,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: textColor,
      });
      
      // Draw impact (colorize based on positive/negative)
      const impactColor: Color = rgb(
        adjustment.impact < 0 ? 0.9 : 0.1,
        adjustment.impact > 0 ? 0.7 : 0.1,
        0.1
      );
      
      page.drawText('$' + adjustment.impact.toLocaleString(), {
        x: margin + factorWidth,
        y: currentY,
        size: 10,
        font: fonts.bold,
        color: impactColor,
      });
      
      // Draw description (if any)
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + factorWidth + impactWidth,
          y: currentY,
          size: 10,
          font: fonts.regular,
          color: textColor,
        });
      }
      
      currentY -= 20;
      
      // Add a new page if we're running out of space
      if (currentY < 50) {
        // TODO: Add new page and reset currentY
      }
    }
  } else {
    page.drawText('No adjustments available', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.italic || fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY;
}
