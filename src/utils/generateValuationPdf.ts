
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { DecodedVehicleInfo } from '@/types/vehicle';

/**
 * Generates a PDF valuation report for a vehicle
 * @param params Object containing vehicle information, valuation, explanation and comparable listings
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(params: {
  vehicle: DecodedVehicleInfo;
  valuation: number;
  explanation: string;
  explanationText?: string;
  comparables?: { source: string; price: number; date: string }[];
}): Promise<Uint8Array> {
  const { vehicle, valuation, explanation, explanationText, comparables = [] } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  let page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Embed fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Define layout constants
  const margin = 50;
  const titleFontSize = 24;
  const headingFontSize = 16;
  const normalFontSize = 12;
  const smallFontSize = 10;
  
  // Set up title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: height - margin - titleFontSize,
    size: titleFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0.8)
  });
  
  // Add current date
  const currentDate = new Date().toLocaleDateString();
  page.drawText(`Generated on: ${currentDate}`, {
    x: width - margin - 150,
    y: height - margin - titleFontSize,
    size: smallFontSize,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: height - margin - titleFontSize - 15 },
    end: { x: width - margin, y: height - margin - titleFontSize - 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Vehicle details section
  let yPos = height - margin - titleFontSize - 50;
  
  page.drawText('Vehicle Information', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0.8)
  });
  
  yPos -= 25;
  
  // Draw vehicle details
  const vehicleDetails = [
    { label: 'Make:', value: vehicle.make || 'N/A' },
    { label: 'Model:', value: vehicle.model || 'N/A' },
    { label: 'Year:', value: vehicle.year ? vehicle.year.toString() : 'N/A' },
    { label: 'VIN:', value: vehicle.vin || 'N/A' },
    { label: 'Mileage:', value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'N/A' },
    { label: 'Condition:', value: vehicle.condition || 'N/A' },
    { label: 'Transmission:', value: vehicle.transmission || 'N/A' },
    { label: 'Body Type:', value: vehicle.bodyType || 'N/A' },
    { label: 'Color:', value: vehicle.color || 'N/A' },
  ];
  
  for (const detail of vehicleDetails) {
    page.drawText(detail.label, {
      x: margin,
      y: yPos,
      size: normalFontSize,
      font: helveticaBoldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(detail.value, {
      x: margin + 100,
      y: yPos,
      size: normalFontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    });
    
    yPos -= 20;
  }
  
  // Valuation section
  yPos -= 20;
  page.drawText('Valuation', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0.8)
  });
  
  yPos -= 25;
  page.drawText('Estimated Value:', {
    x: margin,
    y: yPos,
    size: normalFontSize,
    font: helveticaBoldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText(`$${valuation.toLocaleString()}`, {
    x: margin + 120,
    y: yPos,
    size: 18,
    font: helveticaBoldFont,
    color: rgb(0, 0.5, 0)
  });
  
  // Expert Valuation Commentary section
  yPos -= 40;
  page.drawText('Expert Valuation Commentary', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0.8)
  });
  
  // Draw a light gray background for the commentary
  yPos -= 10;
  const commentaryText = explanationText || explanation || "This valuation explanation is currently unavailable. Please contact support.";
  const commentaryLines = wrapText(commentaryText, helveticaFont, normalFontSize, width - (margin * 2));
  const commentaryHeight = commentaryLines.length * 16 + 20; // Height of all lines plus padding
  
  // Draw background rectangle
  page.drawRectangle({
    x: margin - 10,
    y: yPos - commentaryHeight + 10,
    width: width - (margin * 2) + 20,
    height: commentaryHeight,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  // Format and wrap the explanation text
  yPos -= 15;
  
  for (const line of commentaryLines) {
    page.drawText(line, {
      x: margin,
      y: yPos,
      size: normalFontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    });
    
    yPos -= 16;
    
    // Check if we need a new page
    if (yPos < 100) {
      // Add a new page
      page = pdfDoc.addPage([612, 792]);
      yPos = height - margin;
      
      // Add header to new page
      page.drawText('Vehicle Valuation Report (continued)', {
        x: margin,
        y: height - margin - titleFontSize,
        size: titleFontSize - 4,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0.8)
      });
      
      yPos -= 40;
    }
  }
  
  // Power by note
  yPos -= 15;
  page.drawText('Powered by GPT-4o | CarDetective AI', {
    x: margin,
    y: yPos,
    size: smallFontSize,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Comparables section if available
  if (comparables.length > 0) {
    // Check if we have enough space for the table header + at least one row
    if (yPos < margin + 60) {
      // Add a new page
      page = pdfDoc.addPage([612, 792]);
      yPos = height - margin;
      
      // Add header to new page
      page.drawText('Vehicle Valuation Report (continued)', {
        x: margin,
        y: height - margin - titleFontSize,
        size: titleFontSize - 4,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0.8)
      });
      
      yPos -= 40;
    }
    
    yPos -= 20;
    page.drawText('Comparable Listings', {
      x: margin,
      y: yPos,
      size: headingFontSize,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0.8)
    });
    
    yPos -= 25;
    
    // Table headers
    const columnWidths = [200, 100, 100];
    const startX = margin;
    
    // Draw headers
    page.drawText('Source', {
      x: startX,
      y: yPos,
      size: normalFontSize,
      font: helveticaBoldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText('Price', {
      x: startX + columnWidths[0],
      y: yPos,
      size: normalFontSize,
      font: helveticaBoldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText('Date', {
      x: startX + columnWidths[0] + columnWidths[1],
      y: yPos,
      size: normalFontSize,
      font: helveticaBoldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Horizontal line under headers
    yPos -= 10;
    page.drawLine({
      start: { x: margin, y: yPos },
      end: { x: width - margin, y: yPos },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    yPos -= 15;
    
    // Draw table rows
    for (const comp of comparables) {
      // Check if we need a new page
      if (yPos < margin + 20) {
        // Add a new page
        page = pdfDoc.addPage([612, 792]);
        yPos = height - margin;
        
        // Add header to new page
        page.drawText('Comparable Listings (continued)', {
          x: margin,
          y: height - margin - 30,
          size: headingFontSize,
          font: helveticaBoldFont,
          color: rgb(0, 0, 0.8)
        });
        
        yPos -= 50;
        
        // Redraw table headers
        page.drawText('Source', {
          x: startX,
          y: yPos,
          size: normalFontSize,
          font: helveticaBoldFont,
          color: rgb(0.3, 0.3, 0.3)
        });
        
        page.drawText('Price', {
          x: startX + columnWidths[0],
          y: yPos,
          size: normalFontSize,
          font: helveticaBoldFont,
          color: rgb(0.3, 0.3, 0.3)
        });
        
        page.drawText('Date', {
          x: startX + columnWidths[0] + columnWidths[1],
          y: yPos,
          size: normalFontSize,
          font: helveticaBoldFont,
          color: rgb(0.3, 0.3, 0.3)
        });
        
        // Horizontal line under headers
        yPos -= 10;
        page.drawLine({
          start: { x: margin, y: yPos },
          end: { x: width - margin, y: yPos },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });
        
        yPos -= 15;
      }
      
      // Draw row data
      page.drawText(comp.source, {
        x: startX,
        y: yPos,
        size: normalFontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(`$${comp.price.toLocaleString()}`, {
        x: startX + columnWidths[0],
        y: yPos,
        size: normalFontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(comp.date, {
        x: startX + columnWidths[0] + columnWidths[1],
        y: yPos,
        size: normalFontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });
      
      yPos -= 20;
    }
  }
  
  // Footer
  const footerText = "This valuation is an estimate based on current market data and may vary.";
  page.drawText(footerText, {
    x: margin,
    y: margin - 20,
    size: smallFontSize,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Serialize the PDFDocument to bytes
  return await pdfDoc.save();
}

/**
 * Helper function to wrap text to fit within a specified width
 */
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const width = font.widthOfTextAtSize(currentLine + word + ' ', fontSize);
    
    if (width < maxWidth) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  }
  
  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim());
  }
  
  return lines;
}
