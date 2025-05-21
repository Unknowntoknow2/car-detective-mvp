import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions } from './types';
import { defaultReportOptions } from './defaultReportOptions';

/**
 * Generate a PDF report with the given data and options
 */
export async function generateReport(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size in points

  const mergedOptions: ReportOptions = {
    ...defaultReportOptions,
    ...options,
  };

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  const lineHeight = 24;
  const { width, height } = page.getSize();

  const lines = [
    `Valuation Report`,
    `-----------------------------`,
    `VIN: ${data.vin}`,
    `Year: ${data.year}`,
    `Make: ${data.make}`,
    `Model: ${data.model}`,
    `Trim: ${data.trim ?? 'N/A'}`,
    `Condition: ${data.condition}`,
    `Mileage: ${data.mileage}`,
    `Estimated Price: $${data.price}`,
  ];

  let currentY = height - margin;

  lines.forEach((line) => {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  });

  return pdfDoc.save();
}
