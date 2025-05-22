import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams } from '../types';

/**
 * Generate a premium PDF report for a vehicle valuation
 */
export async function generatePremiumReport(params: ReportGeneratorParams): Promise<Uint8Array> {
  const { data, options, document } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Get the standard fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set up colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.0, 0.3, 0.7);
  const accentColor = rgb(0.0, 0.6, 0.3);
  
  // Page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Y position tracker (start from top)
  let y = height - margin;
  
  // Add premium header with logo and styling
  page.drawText('PREMIUM VALUATION REPORT', {
    x: margin,
    y,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 30;
  
  // Draw vehicle title
  page.drawText(`${data.year} ${data.make} ${data.model} ${data.trim || ''}`, {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: textColor,
  });
  
  y -= 40;
  
  // Draw estimated value with enhanced styling
  page.drawText('Estimated Value', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw the value
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: margin,
    y,
    size: 32,
    font: boldFont,
    color: accentColor,
  });
  
  y -= 20;
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    const confidenceText = `Confidence Score: ${data.confidenceScore}%`;
    page.drawText(confidenceText, {
      x: margin,
      y,
      size: 12,
      font: font,
      color: textColor,
    });
    
    y -= 15;
  }
  
  // Include much more detailed content than the basic report
  // Draw vehicle details section
  y -= 30;
  page.drawText('Vehicle Details', {
    x: margin,
    y,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw vehicle details in a two-column layout
  const detailsData = [
    { label: 'Make', value: data.make },
    { label: 'Model', value: data.model },
    { label: 'Year', value: data.year.toString() },
    { label: 'Mileage', value: `${data.mileage.toLocaleString()} miles` },
    { label: 'VIN', value: data.vin || 'Not provided' },
    { label: 'Body Style', value: data.bodyStyle || 'Not specified' },
    { label: 'Color', value: data.color || 'Not specified' },
    { label: 'Transmission', value: data.transmission || 'Not specified' },
    { label: 'Fuel Type', value: data.fuelType || 'Not specified' },
  ];
  
  const colWidth = contentWidth / 2;
  let currentY = y;
  let colCount = 0;
  
  for (const detail of detailsData) {
    const xPos = margin + (colCount % 2) * colWidth;
    
    // Draw label
    page.drawText(`${detail.label}:`, {
      x: xPos,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    // Draw value
    page.drawText(detail.value, {
      x: xPos + 80,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    colCount++;
    if (colCount % 2 === 0) {
      currentY -= 20;
    }
  }
  
  // Ensure we move to the next section after the details
  y = currentY - 30;
  
  // Draw adjustments section if available
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Value Adjustments', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 25;
    
    // Draw table headers
    page.drawText('Factor', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Impact', {
      x: margin + 150,
      y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Description', {
      x: margin + 250,
      y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    y -= 15;
    
    // Draw a line under the headers
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    y -= 15;
    
    // Draw each adjustment
    for (const adjustment of data.adjustments) {
      // Draw factor
      page.drawText(adjustment.factor, {
        x: margin,
        y,
        size: 10,
        font: font,
        color: textColor,
      });
      
      // Draw impact with color based on positive/negative
      const impactColor = adjustment.impact >= 0 ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0);
      const impactText = `${adjustment.impact >= 0 ? '+' : ''}$${adjustment.impact.toLocaleString()}`;
      
      page.drawText(impactText, {
        x: margin + 150,
        y,
        size: 10,
        font: boldFont,
        color: impactColor,
      });
      
      // Draw description
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 250,
          y,
          size: 10,
          font: font,
          color: textColor,
        });
      }
      
      y -= 20;
    }
    
    // Draw total line
    y -= 10;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    y -= 20;
    
    // Calculate total adjustments
    const totalAdjustment = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const totalAdjustmentText = `${totalAdjustment >= 0 ? '+' : ''}$${totalAdjustment.toLocaleString()}`;
    const totalAdjustmentColor = totalAdjustment >= 0 ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0);
    
    // Draw total adjustment
    page.drawText('Total Adjustments:', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(totalAdjustmentText, {
      x: margin + 150,
      y,
      size: 12,
      font: boldFont,
      color: totalAdjustmentColor,
    });
    
    y -= 30;
  }
  
  // Draw explanation section if included
  if (options.includeExplanation && data.explanation) {
    page.drawText('Valuation Explanation', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Split explanation into multiple lines
    const explanationWords = data.explanation.split(' ');
    let currentLine = '';
    const maxCharsPerLine = 90;
    
    for (const word of explanationWords) {
      if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
        currentLine += (currentLine.length > 0 ? ' ' : '') + word;
      } else {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: 10,
          font: font,
          color: textColor,
        });
        
        y -= 15;
        currentLine = word;
      }
    }
    
    if (currentLine.length > 0) {
      page.drawText(currentLine, {
        x: margin,
        y,
        size: 10,
        font: font,
        color: textColor,
      });
      
      y -= 20;
    }
  }
  
  // Draw photo assessment section if included and photo exists
  if (options.includePhotoAssessment && data.bestPhotoUrl && data.aiCondition) {
    page.drawText('Photo Assessment', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Draw condition summary
    const conditionText = `Condition: ${data.aiCondition.condition || 'Not assessed'}`;
    page.drawText(conditionText, {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    y -= 20;
    
    // Draw condition summary if available
    if (data.aiCondition.summary) {
      const summaryWords = data.aiCondition.summary.split(' ');
      let currentLine = '';
      
      for (const word of summaryWords) {
        if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine += (currentLine.length > 0 ? ' ' : '') + word;
        } else {
          page.drawText(currentLine, {
            x: margin,
            y,
            size: 10,
            font: font,
            color: textColor,
          });
          
          y -= 15;
          currentLine = word;
        }
      }
      
      if (currentLine.length > 0) {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: 10,
          font: font,
          color: textColor,
        });
        
        y -= 20;
      }
    }
    
    // Draw issues detected if available
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y,
        size: 12,
        font: boldFont,
        color: textColor,
      });
      
      y -= 15;
      
      for (const issue of data.aiCondition.issuesDetected) {
        page.drawText(`• ${issue}`, {
          x: margin + 10,
          y,
          size: 10,
          font: font,
          color: textColor,
        });
        
        y -= 15;
      }
    }
  }
  
  // Draw footer with branding if included
  if (options.includeBranding) {
    const footerY = 40;
    
    // Draw line above footer
    page.drawLine({
      start: { x: margin, y: footerY + 10 },
      end: { x: width - margin, y: footerY + 10 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    // Draw footer text
    page.drawText('Generated by Car Detective Premium', {
      x: margin,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Draw date
    const dateText = `Report Date: ${new Date().toLocaleDateString()}`;
    const dateTextWidth = font.widthOfTextAtSize(dateText, 8);
    
    page.drawText(dateText, {
      x: width - margin - dateTextWidth,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  // Add watermark if specified
  if (options.watermark) {
    const watermarkText = typeof options.watermark === 'string' 
      ? options.watermark 
      : 'PREMIUM REPORT';
    
    // Draw watermark diagonally across the page
    const watermarkSize = 60;
    page.drawText(watermarkText, {
      x: width / 2 - 150,
      y: height / 2,
      size: watermarkSize,
      font: boldFont,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: {
        type: 'degrees',
        angle: 315,
        xSkew: 0,
        ySkew: 0,
      },
    });
  }
  
  // Return the PDF as a buffer
  return await pdfDoc.save();
}
