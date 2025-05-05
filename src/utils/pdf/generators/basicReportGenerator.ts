
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData } from '../types';
import { drawTextPair } from '../helpers/pdfHelpers';

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

  // Draw vehicle information
  drawTextPair(page, 'Vehicle', `${reportData.year} ${reportData.make} ${reportData.model}`, { font, boldFont, yPosition, margin, width });
  yPosition -= 30;
  
  if (reportData.vin && reportData.vin !== 'Unknown' && reportData.vin !== '') {
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

  // Add AI Condition Assessment section if available
  if (reportData.aiCondition) {
    yPosition -= 20;
    
    // Define colors based on condition
    let conditionColor = rgb(0.5, 0.5, 0.5); // Default gray
    const confidenceScore = reportData.aiCondition.confidenceScore || 0;
    
    if (reportData.aiCondition.condition === 'Excellent') {
      conditionColor = rgb(0.13, 0.7, 0.3); // Green
    } else if (reportData.aiCondition.condition === 'Good') {
      conditionColor = rgb(0.95, 0.7, 0.1); // Yellow/Gold
    } else if (reportData.aiCondition.condition === 'Fair' || reportData.aiCondition.condition === 'Poor') {
      conditionColor = rgb(0.9, 0.3, 0.2); // Red
    }
    
    // Draw title with brain emoji
    page.drawText('🧠 AI Vehicle Condition Assessment', {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= 25;
    
    // Draw colored box background
    const boxWidth = width - (margin * 2);
    const boxHeight = 100;  // Adjust based on content
    const boxY = yPosition - boxHeight + 15;
    
    // Draw box with light background color (20% opacity of the condition color)
    page.drawRectangle({
      x: margin,
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
    page.drawText(`Condition: ${reportData.aiCondition.condition || 'Unknown'}`, {
      x: margin + 15,
      y: yPosition - 5,
      size: 14,
      font: boldFont,
      color: conditionColor,
    });
    yPosition -= 20;
    
    // Draw confidence score
    page.drawText(`Confidence Score: ${confidenceScore}%`, {
      x: margin + 15,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 20;
    
    // Draw issues detected
    if (reportData.aiCondition.issuesDetected && reportData.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin + 15,
        y: yPosition,
        size: 10,
        font: italicFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      reportData.aiCondition.issuesDetected.slice(0, 2).forEach(issue => {
        page.drawText(`• ${issue}`, {
          x: margin + 25,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
        yPosition -= 12;
      });
      
      if (reportData.aiCondition.issuesDetected.length > 2) {
        page.drawText(`• And ${reportData.aiCondition.issuesDetected.length - 2} more...`, {
          x: margin + 25,
          y: yPosition,
          size: 10,
          font: italicFont,
          color: rgb(0.4, 0.4, 0.4),
        });
        yPosition -= 12;
      }
    } else if (reportData.aiCondition.aiSummary) {
      // If no specific issues but there's a summary
      page.drawText('Analysis Notes:', {
        x: margin + 15,
        y: yPosition,
        size: 10,
        font: italicFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      // Simple word wrapping for summary text
      const maxWidth = boxWidth - 40; // Left and right padding
      const words = reportData.aiCondition.aiSummary.split(' ');
      let line = '';
      let lineY = yPosition;
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, 10);
        
        if (testWidth > maxWidth) {
          page.drawText(line, {
            x: margin + 25,
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
          x: margin + 25,
          y: lineY,
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
      }
    }
    
    // Add AI Verified badge if confidence score is high enough
    if (confidenceScore >= 80) {
      const verifiedText = 'AI Verified';
      const textWidth = boldFont.widthOfTextAtSize(verifiedText, 10);
      const badgeWidth = textWidth + 20;
      const badgeHeight = 20;
      const badgeX = width - margin - badgeWidth;
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
    
    yPosition = boxY - 10; // Adjust position after the box
  }

  // Add explanation if available
  if (reportData.explanation) {
    yPosition -= 20;
    page.drawText('Valuation Explanation:', {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= 20;
    
    // Simple word wrapping for explanation
    const maxWidth = width - (margin * 2);
    const words = reportData.explanation.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, 10);
      
      if (testWidth > maxWidth) {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 10,
          font: font,
        });
        yPosition -= 15;
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    
    // Draw remaining text
    if (line.trim() !== '') {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 10,
        font: font,
      });
      yPosition -= 20;
    }
  }

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
