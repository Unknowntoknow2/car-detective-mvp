
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData } from '../types';

interface BasicReportGeneratorProps {
  pdfDoc: PDFDocument;
  page: any;
  width: number;
  height: number;
  margin: number;
  regularFont: any;
  boldFont: any;
  reportData: ReportData;
}

/**
 * Generates a basic PDF report with key valuation details
 */
export async function generateBasicReport(props: BasicReportGeneratorProps): Promise<void> {
  const { pdfDoc, page, width, height, margin, regularFont, boldFont, reportData } = props;
  let currentY = height - margin;

  // Add header
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  currentY -= 20;

  // Add vehicle details
  page.drawText(`Vehicle: ${reportData.year} ${reportData.make} ${reportData.model}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  currentY -= 15;

  page.drawText(`VIN: ${reportData.vin || 'Not provided'}`, {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  currentY -= 15;

  // Add valuation details
  page.drawText(`Estimated Value: $${reportData.estimatedValue.toLocaleString()}`, {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.7, 0.2)
  });
  currentY -= 20;

  // Add explanation
  const explanationLines = wrapText(reportData.explanation, regularFont, 10, width - margin * 2);
  page.drawText('Explanation:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  currentY -= 15;

  for (const line of explanationLines) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    currentY -= 12;
  }
}

/**
 * Wraps text to fit within a given width
 */
function wrapText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
