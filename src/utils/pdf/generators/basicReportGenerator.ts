
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData } from '../types';
import { drawTextPair } from '../helpers/pdfHelpers';

export async function generateBasicReport(reportData: ReportData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.12, 0.46, 0.70);
  const margin = 50;
  let yPosition = height - margin;

  // Add premium indicator
  if (reportData.isPremium) {
    page.drawText('PREMIUM REPORT', {
      x: width - 150,
      y: height - margin,
      size: 12,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2),
    });
  }

  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: height - margin,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });

  yPosition -= 50;

  // Draw vehicle information
  drawTextPair(page, 'Vehicle', `${reportData.year} ${reportData.make} ${reportData.model}`, { font, boldFont, yPosition, margin, width });
  yPosition -= 30;
  
  if (reportData.vin) {
    drawTextPair(page, 'VIN', reportData.vin, { font, boldFont, yPosition, margin, width });
    yPosition -= 30;
  } else if (reportData.plate && reportData.state) {
    drawTextPair(page, 'License Plate', `${reportData.plate} (${reportData.state})`, { font, boldFont, yPosition, margin, width });
    yPosition -= 30;
  }
  
  drawTextPair(page, 'Mileage', `${reportData.mileage} miles`, { font, boldFont, yPosition, margin, width });
  yPosition -= 30;

  if (reportData.condition) {
    drawTextPair(page, 'Condition', reportData.condition, { font, boldFont, yPosition, margin, width });
    yPosition -= 30;
  }

  if (reportData.zipCode) {
    drawTextPair(page, 'Location', `ZIP: ${reportData.zipCode}`, { font, boldFont, yPosition, margin, width });
    yPosition -= 30;
  }

  // Add disclaimer
  yPosition -= 50;
  page.drawText('Disclaimer: This valuation is for informational purposes only.', {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });

  return pdfDoc.save();
}
