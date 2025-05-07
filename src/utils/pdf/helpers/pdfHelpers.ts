
import { PDFPage, rgb, Color } from 'pdf-lib';

/**
 * Draw a text pair (label and value) on a PDF
 */
export function drawTextPair(
  page: PDFPage,
  label: string,
  value: string,
  options: {
    font: any;
    boldFont: any;
    yPosition: number;
    margin: number;
    width: number;
    labelColor?: Color;
    valueColor?: Color;
    fontSize?: number;
  }
) {
  const {
    font,
    boldFont,
    yPosition,
    margin,
    width,
    labelColor = rgb(0.4, 0.4, 0.4),
    valueColor = rgb(0, 0, 0),
    fontSize = 12
  } = options;

  // Draw label
  page.drawText(label, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: boldFont,
    color: labelColor
  });

  // Draw value
  page.drawText(value, {
    x: margin + 150,
    y: yPosition,
    size: fontSize,
    font,
    color: valueColor
  });
}

/**
 * Draws a section heading on a PDF
 */
export function drawSectionHeading(
  page: PDFPage,
  text: string,
  yPosition: number,
  margin: number,
  font: any,
  fontSize: number = 14,
  color: Color = rgb(0.1, 0.1, 0.1)
) {
  page.drawText(text, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: font,
    color: color
  });
  
  return yPosition - 20; // Return the new Y position after the heading
}

/**
 * Draws a horizontal line on a PDF
 */
export function drawHorizontalLine(
  page: PDFPage, 
  startX: number, 
  endX: number, 
  y: number, 
  lineWidth: number = 1,
  lineColor: Color = rgb(0.8, 0.8, 0.8)
) {
  page.drawLine({
    start: { x: startX, y },
    end: { x: endX, y },
    thickness: lineWidth,
    color: lineColor,
  });
}
