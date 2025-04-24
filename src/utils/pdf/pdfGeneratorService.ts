
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData, PremiumReportInput } from './types';

export async function generateValuationPdf(reportData: ReportData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.12, 0.46, 0.70);
  const textColor = rgb(0, 0, 0);

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

  // Helper function for drawing text pairs
  const drawTextPair = (label: string, value: string) => {
    page.drawText(label, {
      x: margin,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(value, {
      x: width / 2,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: textColor,
    });

    yPosition -= 30;
  };

  // Draw vehicle information
  drawTextPair('Vehicle', `${reportData.year} ${reportData.make} ${reportData.model}`);
  
  if (reportData.vin) {
    drawTextPair('VIN', reportData.vin);
  } else if (reportData.plate && reportData.state) {
    drawTextPair('License Plate', `${reportData.plate} (${reportData.state})`);
  }
  
  drawTextPair('Mileage', `${reportData.mileage} miles`);
  
  if (reportData.condition) {
    drawTextPair('Condition', reportData.condition);
  }
  
  if (reportData.zipCode) {
    drawTextPair('Location', `ZIP: ${reportData.zipCode}`);
  }
  
  if (reportData.color) {
    drawTextPair('Color', reportData.color);
  }

  // Draw CARFAX details if available
  if (reportData.carfaxData) {
    yPosition -= 20;
    page.drawText('Vehicle History (CARFAX)', {
      x: margin,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: primaryColor,
    });
    
    yPosition -= 30;
    
    const carfax = reportData.carfaxData;
    drawTextPair('Accident Reports', carfax.accidentsReported > 0 
      ? `${carfax.accidentsReported} (${carfax.damageSeverity || 'minor'} damage)` 
      : 'None reported');
    drawTextPair('Previous Owners', carfax.owners.toString());
    drawTextPair('Service Records', carfax.serviceRecords.toString());
    
    if (carfax.salvageTitle) {
      drawTextPair('Title Status', carfax.brandedTitle || 'Salvage/Branded');
    } else {
      drawTextPair('Title Status', 'Clean');
    }
  }

  // Add disclaimer
  yPosition -= 50;
  page.drawText('Disclaimer: This valuation is for informational purposes only.', {
    x: margin,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  if (reportData.isPremium) {
    yPosition -= 20;
    page.drawText('This premium report includes verified vehicle history data.', {
      x: margin,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  return pdfDoc.save();
}

export async function generatePremiumReport(input: PremiumReportInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // 8.5 x 11 in
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.12, 0.46, 0.70);
  const textColor = rgb(0, 0, 0);

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
  
  page.drawText(`Vehicle: ${input.vehicleInfo.year} ${input.vehicleInfo.make} ${input.vehicleInfo.model}`, 
    { x: 50, y, size: 12, font });
  y -= 20;
  
  page.drawText(`Mileage: ${input.vehicleInfo.mileage.toLocaleString()} miles`, 
    { x: 50, y, size: 12, font });
  y -= 20;
  
  if (input.vehicleInfo.zipCode) {
    page.drawText(`Location: ${input.vehicleInfo.zipCode}`, { x: 50, y, size: 12, font });
    y -= 30;
  }

  // Valuation section
  page.drawText('Valuation Summary', { x: 50, y, size: 16, font: boldFont, color: primaryColor });
  y -= 25;
  
  page.drawText(`Estimated Value: $${input.valuation.estimatedValue.toLocaleString()}`, 
    { x: 50, y, size: 14, font: boldFont });
  y -= 20;
  
  page.drawText(`Price Range: $${input.valuation.priceRange[0].toLocaleString()} - $${input.valuation.priceRange[1].toLocaleString()}`, 
    { x: 50, y, size: 12, font });
  y -= 20;
  
  page.drawText(`Confidence Score: ${input.valuation.confidenceScore}%`, 
    { x: 50, y, size: 12, font });
  y -= 35;

  // Adjustments section
  if (input.valuation.adjustments.length > 0) {
    page.drawText('Value Adjustments', { x: 50, y, size: 16, font: boldFont, color: primaryColor });
    y -= 25;
    
    input.valuation.adjustments.forEach(adj => {
      page.drawText(`${adj.label}: ${adj.value >= 0 ? '+' : ''}$${adj.value.toLocaleString()}`,
        { x: 60, y, size: 12, font });
      y -= 16;
    });
    y -= 20;
  }

  // CARFAX section
  if (input.carfaxData) {
    page.drawText('Vehicle History (CARFAX)', { x: 50, y, size: 16, font: boldFont, color: primaryColor });
    y -= 25;
    
    const carfax = input.carfaxData;
    const historyItems = [
      `Accidents: ${carfax.accidentsReported} reported${carfax.damageSeverity ? ` (${carfax.damageSeverity} damage)` : ''}`,
      `Previous Owners: ${carfax.owners}`,
      `Service Records: ${carfax.serviceRecords}`,
      `Title Status: ${carfax.salvageTitle ? (carfax.brandedTitle || 'Salvage/Branded') : 'Clean'}`
    ];
    
    historyItems.forEach(item => {
      page.drawText(item, { x: 60, y, size: 12, font });
      y -= 16;
    });
    y -= 20;
  }

  // Footer
  const footerY = 60;
  page.drawText('Report Powered by Car Price Perfector', 
    { x: 50, y: footerY, size: 10, font });
  page.drawText('This estimate is based on market data and vehicle condition. Verify with a professional inspection.', 
    { x: 50, y: footerY - 15, size: 10, font, color: rgb(0.5, 0.5, 0.5) });

  return pdfDoc.save();
}
