
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData } from '../types';
import { drawTextPair } from '../helpers/pdfHelpers';
import { drawAIConditionSection } from '../sections/aiConditionSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawExplanationSection } from '../sections/explanationSection';

export async function generateBasicReport(reportData: ReportData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

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

  // Draw vehicle information section
  // Fixed: Removed extra parameter to match function signature
  yPosition = drawVehicleInfoSection(
    page, 
    reportData, 
    yPosition, 
    { regular: font, bold: boldFont }, 
    { margin, width, height }
  );
  
  // Add AI Condition Assessment section if available
  if (reportData.aiCondition) {
    yPosition -= 20;
    
    yPosition = drawAIConditionSection(
      reportData.aiCondition,
      {
        page,
        yPosition,
        margin,
        width,
        fonts: {
          regular: font,
          bold: boldFont,
          italic: italicFont
        }
      }
    );
  }

  // Add explanation if available
  yPosition = drawExplanationSection(
    reportData.explanation,
    page,
    yPosition,
    margin,
    { regular: font, bold: boldFont }
  );

  // Add disclaimer
  yPosition -= 30;
  page.drawText('Disclaimer: This valuation is for informational purposes only.', {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });

  return pdfDoc.save();
}
