
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PremiumReportInput, ReportData } from '../types';
import { drawTextPair } from '../helpers/pdfHelpers';
import { drawAIConditionSection } from '../sections/aiConditionSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawForecastSection } from '../sections/forecastSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawExplanationSection } from '../sections/explanationSection';

export async function generatePremiumReport(input: PremiumReportInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // 8.5 x 11 in
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = rgb(0.12, 0.46, 0.70);
  let y = 750;

  // Draw header
  page.drawText('Car Price Perfector Premium Report', {
    x: 50,
    y,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  y -= 40;

  // Draw date
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y, size: 12, font });
  y -= 20;
  
  // Create a properly formatted ReportData object from the input
  const reportData: ReportData = {
    vin: input.vehicleInfo.vin || 'Unknown',
    make: input.vehicleInfo.make,
    model: input.vehicleInfo.model,
    year: input.vehicleInfo.year,
    mileage: input.vehicleInfo.mileage || 0,
    condition: 'Good', // Default condition
    estimatedValue: input.valuation.estimatedValue,
    confidenceScore: input.valuation.confidenceScore,
    zipCode: input.vehicleInfo.zipCode || '10001',
    priceRange: input.valuation.priceRange,
    adjustments: input.valuation.adjustments,
    isPremium: true,
    explanation: input.explanation || undefined,
    aiCondition: input.aiCondition || undefined
  };
  
  // Draw vehicle information section
  y = drawVehicleInfoSection(
    page, 
    reportData, 
    y, 
    { regular: font, bold: boldFont }, 
    { 
      margin: 50, 
      width: 612, 
      height: 792,
      titleFontSize: 24,
      headingFontSize: 16,
      normalFontSize: 12,
      smallFontSize: 10
    }
  );
  y -= 10;

  // Valuation section
  page.drawText('Valuation Summary', { x: 50, y, size: 16, font: boldFont, color: primaryColor });
  y -= 25;

  const valuationInfo = [
    `Estimated Value: $${input.valuation.estimatedValue.toLocaleString()}`,
    `Price Range: $${input.valuation.priceRange[0].toLocaleString()} - $${input.valuation.priceRange[1].toLocaleString()}`,
    `Confidence Score: ${input.valuation.confidenceScore}%`
  ];

  valuationInfo.forEach((info, index) => {
    page.drawText(info, { 
      x: 50, 
      y, 
      size: index === 0 ? 14 : 12, 
      font: index === 0 ? boldFont : font 
    });
    y -= 20;
  });
  y -= 15;
  
  // Add AI Condition Assessment section if available
  if (input.aiCondition) {
    y = drawAIConditionSection(
      input.aiCondition,
      {
        page,
        yPosition: y,
        margin: 50,
        width: 612,
        fonts: {
          regular: font,
          bold: boldFont,
          italic: italicFont
        }
      }
    );
  }
  
  // Add 12-Month Forecast section
  if (input.forecast) {
    y = drawForecastSection(
      input.forecast,
      page,
      y,
      50, // margin
      { regular: font, bold: boldFont }
    );
  }

  // Add explanation section if available
  if (input.explanation) {
    y = drawExplanationSection(
      input.explanation,
      page,
      y,
      50, // margin
      { regular: font, bold: boldFont },
      primaryColor
    );
  }

  // Add footer
  const footerY = 60;
  drawFooterSection(
    page,
    footerY,
    50, // margin
    { regular: font }
  );

  return pdfDoc.save();
}
