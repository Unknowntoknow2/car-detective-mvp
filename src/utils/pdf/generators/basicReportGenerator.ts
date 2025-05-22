
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData, ReportOptions } from '../types';

/**
 * Generate a basic PDF report for a vehicle valuation
 */
export async function generateBasicReport(
  data: ReportData,
  options: ReportOptions
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Get the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set up colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.2, 0.4, 0.8);
  
  // Page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Y position tracker (start from top)
  let y = height - margin;
  
  // Add header section
  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 30;
  
  // Draw vehicle information
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: textColor,
  });
  
  y -= 25;
  
  // Draw vehicle details
  if (data.mileage) {
    page.drawText(`Mileage: ${data.mileage.toLocaleString()} miles`, {
      x: margin,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 15;
  }
  
  if (data.vin) {
    page.drawText(`VIN: ${data.vin}`, {
      x: margin,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 15;
  }
  
  y -= 20;
  
  // Draw valuation section
  page.drawText('Estimated Value', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw the estimated value
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: textColor,
  });
  
  y -= 30;
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length >= 2) {
    page.drawText(`Price Range: $${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: margin,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 20;
  }
  
  // Add adjustments table (if adjustments exist)
  if (data.adjustments && data.adjustments.length > 0) {
    // Call a helper function to draw adjustments table
    drawAdjustmentsTable(page, data.adjustments, {
      y: y - 20,
      contentWidth,
      font,
      boldFont,
      textColor
    });
    
    y -= 30 + (data.adjustments.length * 20);
  }
  
  // Add explanation if included in options
  if (options.includeExplanation && data.explanation) {
    page.drawText('Valuation Explanation', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 15;
    
    // Split explanation into multiple lines
    const explanationWords = data.explanation.split(' ');
    let currentLine = '';
    const maxCharsPerLine = 80;
    
    for (const word of explanationWords) {
      if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
        currentLine += (currentLine.length > 0 ? ' ' : '') + word;
      } else {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: 9,
          font: font,
          color: textColor,
        });
        
        y -= 12;
        currentLine = word;
      }
    }
    
    if (currentLine.length > 0) {
      page.drawText(currentLine, {
        x: margin,
        y,
        size: 9,
        font: font,
        color: textColor,
      });
    }
  }
  
  // Return the PDF as a buffer
  return await pdfDoc.save();
}

// Helper function for drawAdjustmentsTable
function drawAdjustmentsTable(
  page: any, 
  adjustments: any[], 
  options: { y: number; contentWidth: number; font: any; boldFont: any; textColor: any }
) {
  // Implementation details would go here
  console.log('Drawing adjustments table with', adjustments.length, 'items');
  
  const { y, contentWidth, font, boldFont, textColor } = options;
  const margin = 50;
  
  // Draw table header
  page.drawText('Adjustment Factor', {
    x: margin,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + 150,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + 250,
    y,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  let currentY = y - 15;
  
  // Draw each adjustment
  for (const adjustment of adjustments) {
    page.drawText(adjustment.factor, {
      x: margin,
      y: currentY,
      size: 9,
      font: font,
      color: textColor,
    });
    
    const impact = adjustment.impact;
    const impactColor = impact >= 0 ? { r: 0, g: 0.5, b: 0 } : { r: 0.8, g: 0, b: 0 };
    
    page.drawText(`${impact >= 0 ? '+' : ''}$${impact.toLocaleString()}`, {
      x: margin + 150,
      y: currentY,
      size: 9,
      font: font,
      color: impactColor,
    });
    
    if (adjustment.description) {
      page.drawText(adjustment.description, {
        x: margin + 250,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
    }
    
    currentY -= 15;
  }
}
