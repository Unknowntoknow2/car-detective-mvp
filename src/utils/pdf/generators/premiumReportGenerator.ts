
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PremiumReportInput } from '../types';
import { drawTextPair } from '../helpers/pdfHelpers';

export async function generatePremiumReport(input: PremiumReportInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // 8.5 x 11 in
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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

  // Vehicle details section
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y, size: 12, font });
  y -= 20;
  
  if (input.vehicleInfo.vin) {
    page.drawText(`VIN: ${input.vehicleInfo.vin}`, { x: 50, y, size: 12, font });
    y -= 20;
  }

  const vehicleInfo = [
    `Vehicle: ${input.vehicleInfo.year} ${input.vehicleInfo.make} ${input.vehicleInfo.model}`,
    `Mileage: ${input.vehicleInfo.mileage?.toLocaleString()} miles`,
    input.vehicleInfo.zipCode ? `Location: ${input.vehicleInfo.zipCode}` : null
  ].filter(Boolean);

  vehicleInfo.forEach(info => {
    if (info) {
      page.drawText(info, { x: 50, y, size: 12, font });
      y -= 20;
    }
  });
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
  
  // Add 12-Month Forecast section
  if (input.forecast) {
    page.drawText('12-Month Value Forecast', { x: 50, y, size: 16, font: boldFont, color: primaryColor });
    y -= 25;
    
    const forecastInfo = [
      `Projected Value (12 months): $${input.forecast.estimatedValueAt12Months.toLocaleString()}`,
      `Projected Change: ${input.forecast.percentageChange >= 0 ? '+' : ''}${input.forecast.percentageChange.toFixed(1)}%`,
      `Best Time to Sell: ${input.forecast.bestTimeToSell}`,
      `Market Trend: ${input.forecast.valueTrend === 'increasing' ? 'Appreciating' : 
                          input.forecast.valueTrend === 'decreasing' ? 'Depreciating' : 'Stable'}`
    ];
    
    forecastInfo.forEach(info => {
      page.drawText(info, { x: 50, y, size: 12, font });
      y -= 20;
    });
    y -= 15;
  }

  // Add footer
  const footerY = 60;
  page.drawText('Report Powered by Car Price Perfector', 
    { x: 50, y: footerY, size: 10, font });
  page.drawText('This estimate is based on market data and vehicle condition. Verify with a professional inspection.', 
    { x: 50, y: footerY - 15, size: 10, font, color: rgb(0.5, 0.5, 0.5) });

  return pdfDoc.save();
}
