
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions } from '../types';
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';

export async function generatePremiumReport(
  data: ReportData, 
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  let yPosition = height - 50;
  
  // Header
  page.drawText('Car Detective Premium Valuation Report', {
    x: 50,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  yPosition -= 40;
  
  // Vehicle Information
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  
  yPosition -= 25;
  
  // Basic details
  const basicInfo = [
    `VIN: ${data.vin || 'N/A'}`,
    `Mileage: ${data.mileage?.toLocaleString() || 'N/A'} miles`,
    `Condition: ${data.condition}`,
    `Location: ${data.zipCode}`
  ];
  
  basicInfo.forEach(info => {
    page.drawText(info, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  });
  
  yPosition -= 20;
  
  // Valuation Summary
  page.drawText('Valuation Summary', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  });
  
  yPosition -= 25;
  
  page.drawText(`Estimated Value: $${data.estimatedValue.toLocaleString()}`, {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0, 0.6, 0),
  });
  
  yPosition -= 20;
  
  page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
    x: 50,
    y: yPosition,
    size: 12,
    font,
  });
  
  yPosition -= 40;
  
  // STAT.vin Section for Premium Users
  if (options.enrichedData?.sources?.statVin) {
    const statVin = options.enrichedData.sources.statVin;
    
    page.drawText('STAT.vin Auction Report', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.4, 0.8),
    });
    
    yPosition -= 25;
    
    const auctionInfo = [
      `Source: STAT.vin Professional Database`,
      `Last Auction Date: ${statVin.auctionSalesHistory?.[0]?.date || 'N/A'}`,
      `Last Sale Price: $${statVin.auctionSalesHistory?.[0]?.price?.toLocaleString() || 'N/A'}`,
      `Status: ${statVin.auctionSalesHistory?.[0]?.status || 'N/A'}`,
      `Location: ${statVin.auctionSalesHistory?.[0]?.location || 'N/A'}`,
      `Auction House: ${statVin.auctionSalesHistory?.[0]?.auction || 'N/A'}`
    ];
    
    auctionInfo.forEach(info => {
      page.drawText(info, { x: 70, y: yPosition, size: 11, font });
      yPosition -= 18;
    });
    
    // Damage History Section
    if (statVin.damageHistory && statVin.damageHistory.length > 0) {
      yPosition -= 10;
      page.drawText('Damage History:', {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.8, 0.2, 0.2),
      });
      
      yPosition -= 20;
      
      statVin.damageHistory.slice(0, 3).forEach(damage => {
        const damageText = `${damage.date}: ${damage.severity} damage - ${damage.description}`;
        page.drawText(damageText, { x: 90, y: yPosition, size: 10, font });
        yPosition -= 16;
      });
    }
    
    // Title History Section
    if (statVin.titleHistory && statVin.titleHistory.length > 0) {
      yPosition -= 10;
      page.drawText('Title History:', {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont,
      });
      
      yPosition -= 20;
      
      const latestTitle = statVin.titleHistory[0];
      page.drawText(`Current Title: ${latestTitle.titleType} (${latestTitle.state})`, {
        x: 90,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= 16;
    }
    
    yPosition -= 20;
    
    // STAT.vin Link
    page.drawText(`View full VIN report: https://stat.vin/vin-decoder/${statVin.vin}`, {
      x: 70,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0, 0, 0.8),
    });
    
    yPosition -= 30;
  }
  
  // Adjustments Section
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Price Adjustments', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
    });
    
    yPosition -= 25;
    
    data.adjustments.forEach(adjustment => {
      const impactText = adjustment.impact > 0 ? `+$${adjustment.impact}` : `-$${Math.abs(adjustment.impact)}`;
      page.drawText(`${adjustment.factor}: ${impactText}`, {
        x: 70,
        y: yPosition,
        size: 11,
        font,
      });
      
      if (adjustment.description) {
        yPosition -= 15;
        page.drawText(adjustment.description, {
          x: 90,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
      
      yPosition -= 20;
    });
  }
  
  // Footer
  const footer = `Generated on ${new Date().toLocaleDateString()} • Car Detective Premium Report`;
  page.drawText(footer, {
    x: 50,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  return await pdfDoc.save();
}
