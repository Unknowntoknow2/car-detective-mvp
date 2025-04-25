
import { PDFPage, PDFFont, rgb, Color } from 'pdf-lib';

interface DrawTextPairOptions {
  font: PDFFont;
  boldFont: PDFFont;
  yPosition: number;
  margin: number;
  width: number;
  labelColor?: Color;
  valueColor?: Color;
}

export function drawTextPair(
  page: PDFPage,
  label: string,
  value: string,
  options: DrawTextPairOptions
) {
  const { font, boldFont, yPosition, margin, width, labelColor, valueColor } = options;
  
  page.drawText(label, {
    x: margin,
    y: yPosition,
    size: 12,
    font: font,
    color: labelColor || rgb(0.4, 0.4, 0.4)
  });

  page.drawText(value, {
    x: width / 2,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: valueColor || rgb(0, 0, 0)
  });
}
