// Fixed import for formatCurrency from the correct module path
import { formatCurrency } from '@/utils/formatters';
import { AdjustmentBreakdown, SectionParams } from '../types';

export const drawAdjustmentTable = (params: SectionParams, adjustments: AdjustmentBreakdown[]): number => {
  const { page, y, width, margin, boldFont, regularFont, primaryColor, textColor } = params;
  const tableX = margin;
  let currentY = y;
  const rowHeight = 20;
  const numColumns = 3;
  const columnWidths = [width * 0.4, width * 0.3, width * 0.3]; // Adjusted for 3 columns
  const headers = ['Factor', 'Description', 'Impact'];

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
    alignment: 'left' | 'center' | 'right' = 'left'
  ) => {
    const words = text.split(' ');
    let line = '';
    let yOffset = y;

    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > colWidth && line !== '') {
        // Draw the line
        page.drawText(line.trim(), {
          x: x,
          y: yOffset,
          font: font,
          size: fontSize,
          color: color,
          wordBreaks: ['break-word']
        });
        yOffset -= fontSize * 1.2; // Adjust line spacing
        line = word + ' ';
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
          wordBreaks: ['break-word']
        });
      }
    });

    return yOffset; // Return the new Y offset after drawing the cell
  };

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
      textColor
    );

    // Draw Description cell
    const descriptionY = drawTableCell(
      page,
      adjustment.description || 'N/A',
      tableX + columnWidths[0],
      cellY,
      columnWidths[1],
      regularFont,
      10,
      textColor
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
      'right'
    );

    // Determine the lowest Y value after drawing all cells in the row
    const lowestY = Math.min(factorY, descriptionY, impactY);

    // Update currentY to the lowest Y value minus some padding
    currentY = lowestY - 5;

    // Draw row separator
    page.drawLine({
      start: { x: tableX, y: currentY + 3 },
      end: { x: tableX + width, y: currentY + 3 },
      color: primaryColor,
      thickness: 0.5,
    });
  });

  return currentY;
};
