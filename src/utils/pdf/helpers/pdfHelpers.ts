
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
