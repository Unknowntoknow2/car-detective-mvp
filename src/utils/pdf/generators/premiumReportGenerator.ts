
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams } from '../types';

/**
 * Generate a premium PDF report for a vehicle valuation with more details
 * @param params The parameters for the report generator
 * @returns A promise resolving to the PDF document as a Uint8Array
 */
export async function generatePremiumReport(
  params: ReportGeneratorParams
): Promise<Uint8Array> {
  const { data, options } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Get the standard fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set up colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.2, 0.5, 0.8);
  
  // Page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Y position tracker (start from top)
  let y = height - margin;
  
  // Draw header with logo and title
  page.drawText('Premium Vehicle Valuation Report', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 10;
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  y -= 30;
  
  // Draw vehicle information section
  page.drawText('Vehicle Information', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Create table for vehicle details
  const vehicleDetails = [
    { label: 'Make', value: data.make },
    { label: 'Model', value: data.model },
    { label: 'Year', value: data.year.toString() },
    { label: 'VIN', value: data.vin || 'Not provided' },
    { label: 'Mileage', value: data.mileage ? `${data.mileage.toLocaleString()} miles` : 'Not provided' },
    { label: 'Body Style', value: data.bodyType || data.bodyStyle || 'Not provided' },
    { label: 'Exterior Color', value: data.color || 'Not provided' },
    { label: 'Transmission', value: data.transmission || 'Not provided' },
    { label: 'Fuel Type', value: data.fuelType || 'Not provided' },
  ];
  
  // Arrange in two columns
  const columnWidth = contentWidth / 2 - 20;
  for (let i = 0; i < vehicleDetails.length; i++) {
    const detail = vehicleDetails[i];
    const isLeftColumn = i % 2 === 0;
    const x = isLeftColumn ? margin : margin + columnWidth + 40;
    
    page.drawText(detail.label + ':', {
      x,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(detail.value, {
      x: x + 80,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    if (!isLeftColumn || i === vehicleDetails.length - 1) {
      y -= 20;
    }
  }
  
  y -= 20;
  
  // Draw valuation section
  page.drawText('Valuation Summary', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw estimated value
  page.drawText('Estimated Value:', {
    x: margin,
    y,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: margin + 150,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 25;
  
  // Draw price range
  if (data.priceRange && data.priceRange.length >= 2) {
    page.drawText('Price Range:', {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: margin + 150,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 20;
  }
  
  // Draw confidence score
  if (data.confidenceScore) {
    page.drawText('Confidence Score:', {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`${data.confidenceScore}%`, {
      x: margin + 150,
      y,
      size: 10,
      font: font,
      color: textColor,
    });
    
    y -= 20;
  }
  
  y -= 10;
  
  // Draw adjustments section if adjustments exist
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Valuation Adjustments', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Header for adjustments table
    page.drawText('Factor', {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Impact', {
      x: margin + 200,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Description', {
      x: margin + 300,
      y,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    y -= 15;
    
    // Draw a line
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    y -= 15;
    
    // List all adjustments
    for (const adjustment of data.adjustments) {
      page.drawText(adjustment.factor, {
        x: margin,
        y,
        size: 9,
        font: font,
        color: textColor,
      });
      
      const impact = adjustment.impact;
      const impactText = `${impact >= 0 ? '+' : ''}$${impact.toLocaleString()}`;
      const impactColor = impact >= 0 ? rgb(0.2, 0.6, 0.2) : rgb(0.8, 0.2, 0.2);
      
      page.drawText(impactText, {
        x: margin + 200,
        y,
        size: 9,
        font: font,
        color: impactColor,
      });
      
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 300,
          y,
          size: 9,
          font: font,
          color: textColor,
        });
      }
      
      y -= 15;
    }
    
    y -= 15;
  }
  
  // Draw photo assessment section if included and photos exist
  if (options.includePhotoAssessment && data.photoAssessment) {
    page.drawText('Photo Assessment', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Process each photo category
    const categories = ['exterior', 'interior', 'mechanical'];
    
    for (const category of categories) {
      // Check if this category has photos
      // Use optional chaining and type assertion to handle the index access
      const photos = data.photoAssessment[category as keyof typeof data.photoAssessment] as string[] | undefined;
      
      if (photos && photos.length > 0) {
        // Draw category title
        page.drawText(`${category.charAt(0).toUpperCase() + category.slice(1)} Photos`, {
          x: margin,
          y,
          size: 10,
          font: boldFont,
          color: textColor,
        });
        
        y -= 15;
        
        // List photo findings
        for (const finding of photos) {
          page.drawText(`• ${finding}`, {
            x: margin + 15,
            y,
            size: 9,
            font: font,
            color: textColor,
          });
          
          y -= 12;
        }
        
        y -= 10;
      }
    }
  }
  
  // Draw explanation if included
  if (options.includeExplanation && data.explanation) {
    page.drawText('Valuation Explanation', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Split explanation into multiple lines
    const explanationLines = splitTextToLines(data.explanation, 90);
    
    for (const line of explanationLines) {
      page.drawText(line, {
        x: margin,
        y,
        size: 9,
        font: font,
        color: textColor,
      });
      
      y -= 12;
    }
  }
  
  // Draw footer
  const footerY = 40;
  
  page.drawLine({
    start: { x: margin, y: footerY + 15 },
    end: { x: width - margin, y: footerY + 15 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  page.drawText('This report was generated on ' + new Date().toLocaleDateString(), {
    x: margin,
    y: footerY,
    size: 8,
    font: font,
    color: textColor,
  });
  
  if (options.includeBranding) {
    page.drawText('Car Detective Premium Valuation Service', {
      x: width - margin - 200,
      y: footerY,
      size: 8,
      font: boldFont,
      color: primaryColor,
    });
  }
  
  // Return the PDF as a buffer
  return await pdfDoc.save();
}

/**
 * Helper function to split text into lines of a certain length
 */
function splitTextToLines(text: string, charsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= charsPerLine) {
      currentLine += (currentLine.length > 0 ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines;
}
