
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PremiumReportInput } from '../types';
import { drawTextPair } from '../helpers/pdfHelpers';

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
  
  // Add AI Condition Assessment section if available
  if (input.aiCondition) {
    page.drawText('🧠 AI Vehicle Condition Assessment', { 
      x: 50, 
      y, 
      size: 16, 
      font: boldFont, 
      color: primaryColor 
    });
    y -= 25;
    
    // Define colors based on condition
    let conditionColor = rgb(0.5, 0.5, 0.5); // Default gray
    const confidenceScore = input.aiCondition.confidenceScore || 0;
    
    if (input.aiCondition.condition === 'Excellent') {
      conditionColor = rgb(0.13, 0.7, 0.3); // Green
    } else if (input.aiCondition.condition === 'Good') {
      conditionColor = rgb(0.95, 0.7, 0.1); // Yellow/Gold
    } else if (input.aiCondition.condition === 'Fair' || input.aiCondition.condition === 'Poor') {
      conditionColor = rgb(0.9, 0.3, 0.2); // Red
    }
    
    // Draw box background
    const boxWidth = 512; // Page width - margins
    const boxHeight = 120; // Adjust based on content
    const boxX = 50;
    const boxY = y - boxHeight + 15;
    
    // Draw box with light background color
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: {
        r: conditionColor.r * 0.95 + 0.05,
        g: conditionColor.g * 0.95 + 0.05,
        b: conditionColor.b * 0.95 + 0.05,
      },
      opacity: 0.2,
      borderColor: conditionColor,
      borderWidth: 1,
    });
    
    // Draw condition in large bold text
    page.drawText(`Condition: ${input.aiCondition.condition || 'Unknown'}`, {
      x: boxX + 15,
      y: y - 5,
      size: 14,
      font: boldFont,
      color: conditionColor,
    });
    y -= 20;
    
    // Draw confidence score
    page.drawText(`Confidence Score: ${confidenceScore}%`, {
      x: boxX + 15,
      y,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 20;
    
    // Draw issues detected
    if (input.aiCondition.issuesDetected && input.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: boxX + 15,
        y,
        size: 10,
        font: italicFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 15;
      
      input.aiCondition.issuesDetected.slice(0, 3).forEach(issue => {
        page.drawText(`• ${issue}`, {
          x: boxX + 25,
          y,
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
        y -= 12;
      });
      
      if (input.aiCondition.issuesDetected.length > 3) {
        page.drawText(`• And ${input.aiCondition.issuesDetected.length - 3} more...`, {
          x: boxX + 25,
          y,
          size: 10,
          font: italicFont,
          color: rgb(0.4, 0.4, 0.4),
        });
        y -= 12;
      }
    } else if (input.aiCondition.aiSummary) {
      // If no specific issues but there's a summary
      page.drawText('Analysis Notes:', {
        x: boxX + 15,
        y,
        size: 10,
        font: italicFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 15;
      
      // Simple word wrapping for summary text
      const maxWidth = boxWidth - 40; // Left and right padding
      const words = input.aiCondition.aiSummary.split(' ');
      let line = '';
      let lineY = y;
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, 10);
        
        if (testWidth > maxWidth) {
          page.drawText(line, {
            x: boxX + 25,
            y: lineY,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          lineY -= 12;
          line = word + ' ';
          
          // Check if we need more space
          if (lineY < boxY + 15) {
            break; // Stop if we run out of space in the box
          }
        } else {
          line = testLine;
        }
      }
      
      // Draw remaining text
      if (line.trim() !== '' && lineY >= boxY + 15) {
        page.drawText(line, {
          x: boxX + 25,
          y: lineY,
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
        lineY -= 12;
      }
      
      y = lineY;
    }
    
    // Add AI Verified badge if confidence score is high enough
    if (confidenceScore >= 80) {
      const verifiedText = 'AI Verified';
      const textWidth = boldFont.widthOfTextAtSize(verifiedText, 10);
      const badgeWidth = textWidth + 20;
      const badgeHeight = 20;
      const badgeX = 562 - badgeWidth; // Page width - margin - badge width
      const badgeY = boxY + 10;
      
      // Draw badge background
      page.drawRectangle({
        x: badgeX,
        y: badgeY,
        width: badgeWidth,
        height: badgeHeight,
        color: rgb(0.13, 0.7, 0.3), // Green
        borderColor: rgb(0.1, 0.6, 0.2),
        borderWidth: 1,
        opacity: 0.9,
      });
      
      // Draw badge text
      page.drawText(verifiedText, {
        x: badgeX + 10,
        y: badgeY + 6,
        size: 10,
        font: boldFont,
        color: rgb(1, 1, 1), // White
      });
    }
    
    y = boxY - 20; // Adjust position to after the box
  }
  
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
