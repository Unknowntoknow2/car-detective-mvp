
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportGeneratorParams } from '../types';

/**
 * Generate a premium PDF report for a vehicle valuation
 * This enhanced report includes additional sections and styling
 */
export async function generatePremiumPdf(
  params: ReportGeneratorParams
): Promise<Uint8Array> {
  const { data, options } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Set up colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.1, 0.4, 0.7); // Deep blue for premium
  const accentColor = rgb(0.8, 0.6, 0.1); // Gold accent for premium
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  
  // Y position tracker (start from top)
  let y = height - margin;

  // Create fonts object for consistent access across sections
  const fonts = {
    regular: regularFont,
    bold: boldFont,
    italic: italicFont
  };
  
  // Draw premium header with logo
  // Draw header
  page.drawText('PREMIUM VALUATION REPORT', {
    x: margin,
    y: y,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 15;
  
  // Draw subtitle
  page.drawText('Expert Vehicle Analysis', {
    x: margin,
    y: y,
    size: 12,
    font: italicFont,
    color: textColor,
  });
  
  y -= 30;
  
  // Draw vehicle name with premium styling
  page.drawRectangle({
    x: margin - 10,
    y: y - 30,
    width: width - (margin * 2) + 20,
    height: 50,
    color: rgb(0.95, 0.95, 1.0), // Very light blue background
    borderColor: primaryColor,
    borderWidth: 1,
    borderOpacity: 0.5,
  });
  
  // Draw vehicle name
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y: y - 5,
    size: 18,
    font: boldFont,
    color: primaryColor,
  });
  
  // Add trim if available
  if (data.trim) {
    page.drawText(data.trim, {
      x: margin,
      y: y - 25,
      size: 12,
      font: regularFont,
      color: textColor,
    });
  }
  
  y -= 50;
  
  // Draw valuation summary section
  page.drawText('Valuation Summary', {
    x: margin,
    y: y,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 30;
  
  // Draw estimated value box
  const valueBoxWidth = 300;
  const valueBoxHeight = 60;
  
  page.drawRectangle({
    x: margin,
    y: y - valueBoxHeight,
    width: valueBoxWidth,
    height: valueBoxHeight,
    color: rgb(0.97, 0.97, 1.0), // Very light blue
    borderColor: accentColor,
    borderWidth: 2,
  });
  
  // Draw estimated value label
  page.drawText('Estimated Value', {
    x: margin + 10,
    y: y - 25,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  // Draw the value with premium styling
  const valueText = `$${data.estimatedValue.toLocaleString()}`;
  const valueTextWidth = boldFont.widthOfTextAtSize(valueText, 24);
  
  page.drawText(valueText, {
    x: margin + valueBoxWidth - valueTextWidth - 20,
    y: y - 30,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= valueBoxHeight + 20;
  
  // Draw confidence score if available
  if (data.confidenceScore !== undefined) {
    page.drawText('Confidence Score', {
      x: margin,
      y: y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    y -= 15;
    
    // Draw confidence meter
    const meterWidth = 200;
    const meterHeight = 20;
    
    // Background of meter
    page.drawRectangle({
      x: margin,
      y: y - meterHeight,
      width: meterWidth,
      height: meterHeight,
      color: rgb(0.9, 0.9, 0.9), // Light gray
    });
    
    // Filled portion of meter
    const fillWidth = meterWidth * (data.confidenceScore / 100);
    
    page.drawRectangle({
      x: margin,
      y: y - meterHeight,
      width: fillWidth,
      height: meterHeight,
      color: data.confidenceScore > 80 ? rgb(0.2, 0.7, 0.3) : // Green for high
             data.confidenceScore > 60 ? rgb(0.9, 0.7, 0.1) : // Yellow for medium
             rgb(0.8, 0.2, 0.2), // Red for low
    });
    
    // Score percentage text
    page.drawText(`${data.confidenceScore}%`, {
      x: margin + meterWidth + 10,
      y: y - 15,
      size: 14,
      font: boldFont,
      color: textColor,
    });
    
    y -= meterHeight + 25;
  }
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    page.drawText('Market Price Range', {
      x: margin,
      y: y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    y -= 15;
    
    // Draw min-max range
    page.drawText(`$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: margin,
      y: y,
      size: 12,
      font: regularFont,
      color: textColor,
    });
    
    y -= 25;
  }
  
  // Draw vehicle details section
  page.drawText('Vehicle Details', {
    x: margin,
    y: y,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Create a two-column layout for vehicle details
  const leftColumnX = margin;
  const rightColumnX = margin + 250;
  let detailsY = y;
  
  // Helper to draw a detail item
  const drawDetail = (x: number, label: string, value: string) => {
    // Draw label
    page.drawText(label, {
      x,
      y: detailsY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    // Draw value
    page.drawText(value, {
      x: x + 100,
      y: detailsY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    
    detailsY -= 20;
  };
  
  // Left column details
  detailsY = y;
  if (data.mileage) drawDetail(leftColumnX, 'Mileage:', `${data.mileage.toLocaleString()} miles`);
  if (data.condition) drawDetail(leftColumnX, 'Condition:', data.condition);
  if (data.fuelType) drawDetail(leftColumnX, 'Fuel Type:', data.fuelType);
  if (data.bodyStyle) drawDetail(leftColumnX, 'Body Style:', data.bodyStyle);
  
  // Right column details
  detailsY = y;
  if (data.transmission) drawDetail(rightColumnX, 'Transmission:', data.transmission);
  if (data.color) drawDetail(rightColumnX, 'Color:', data.color);
  if (data.vin) drawDetail(rightColumnX, 'VIN:', data.vin);
  if (data.zipCode) drawDetail(rightColumnX, 'Location:', `ZIP: ${data.zipCode}`);
  
  // Update y position to the lower of the two columns
  y = detailsY - 10;
  
  // Draw adjustments section if available
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Value Adjustments', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Draw column headers
    page.drawText('Factor', {
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
    
    y -= 15;
    
    // Draw table lines
    page.drawLine({
      start: { x: margin, y: y + 5 },
      end: { x: width - margin, y: y + 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    // Draw each adjustment row
    for (const adjustment of data.adjustments) {
      y -= 15;
      
      // Factor
      page.drawText(adjustment.factor, {
        x: margin,
        y,
        size: 9,
        font: regularFont,
        color: textColor,
      });
      
      // Impact (positive in green, negative in red)
      const impact = adjustment.impact;
      const impactColor = impact >= 0 
        ? rgb(0, 0.5, 0) // Green for positive
        : rgb(0.8, 0, 0); // Red for negative
      
      page.drawText(`${impact >= 0 ? '+' : ''}$${Math.abs(impact).toLocaleString()}`, {
        x: margin + 150,
        y,
        size: 9,
        font: boldFont,
        color: impactColor,
      });
      
      // Description (if available)
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 250,
          y,
          size: 9,
          font: regularFont,
          color: textColor,
        });
      }
    }
    
    y -= 25;
  }
  
  // Draw watermark for sample reports
  if (data.isSample || options.watermark) {
    const watermarkText = typeof options.watermark === 'string' ? options.watermark : 'SAMPLE REPORT';
    
    // Since we can't use .rotate and .translate, we'll manually calculate the position
    // for a diagonal watermark across the page
    
    // Create a new page for watermark (we'll delete it after drawing watermark)
    const tempPage = pdfDoc.addPage([width, height]);
    tempPage.drawText(watermarkText, {
      x: width / 2 - 200, // Center horizontally
      y: height / 2, // Center vertically
      size: 80,
      font: boldFont,
      color: rgb(0.85, 0.85, 0.85), // Light gray
      opacity: 0.3,
      rotate: Math.PI / -4, // -45 degrees in radians
    });
    
    // Instead of rotating, we'll use a workaround - the watermark is drawn
    // at an angle on the page without using rotate/translate methods
    
    // Draw the watermark on the main page as well
    page.drawText(watermarkText, {
      x: width / 2 - 200, // Center horizontally
      y: height / 2, // Center vertically
      size: 80,
      font: boldFont,
      color: rgb(0.85, 0.85, 0.85), // Light gray
      opacity: 0.3,
    });
    
    // Remove the temporary page
    pdfDoc.removePage(pdfDoc.getPageCount() - 1);
  }
  
  // Draw footer
  const footerY = 30;
  
  // Draw line above footer
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Draw company and copyright information
  page.drawText(`© ${new Date().getFullYear()} Car Detective - Premium Vehicle Valuation`, {
    x: margin,
    y: footerY,
    size: 8,
    font: regularFont,
    color: textColor,
    opacity: 0.7,
  });
  
  // Draw generation date
  if (data.generatedAt) {
    const date = new Date(data.generatedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    page.drawText(`Generated: ${formattedDate}`, {
      x: width - margin - 150,
      y: footerY,
      size: 8,
      font: regularFont,
      color: textColor,
      opacity: 0.7,
    });
  }
  
  // Return the PDF as a Uint8Array
  return await pdfDoc.save();
}
