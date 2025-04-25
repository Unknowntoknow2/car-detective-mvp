
import { PDFPage, PDFFont, RGB } from 'pdf-lib';

interface DrawTextPairOptions {
  font: PDFFont;
  boldFont: PDFFont;
  yPosition: number;
  margin: number;
  width: number;
  labelColor?: RGB;
  valueColor?: RGB;
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
    color: labelColor || { red: 0.4, green: 0.4, blue: 0.4 }
  });

  page.drawText(value, {
    x: width / 2,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: valueColor || { red: 0, green: 0, blue: 0 }
  });
}
