
import { PDFPage, PDFDocument, rgb } from 'pdf-lib';
import { PdfFonts, PdfConstants } from '../components/pdfCommon';

interface Comparable {
  source: string;
  price: number;
  date: string;
}

/**
 * Draw comparables section on the PDF
 * Returns the new PDFPage and Y position after drawing the section
 */
export function drawComparablesSection(
  pdfDoc: PDFDocument,
  page: PDFPage,
  comparables: Comparable[],
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): { page: PDFPage; yPos: number } {
  if (comparables.length === 0) {
    return { page, yPos };
  }
  
  const { margin, width, height, headingFontSize, normalFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Check if we have enough space for the table header + at least one row
  if (yPos < margin + 60) {
    // Add a new page
    page = pdfDoc.addPage([612, 792]);
    yPos = height - margin;
    
    // Add header to new page
    page.drawText('Vehicle Valuation Report (continued)', {
      x: margin,
      y: height - margin - 20,
      size: headingFontSize + 4,
      font: boldFont,
      color: rgb(0, 0, 0.8)
    });
    
    yPos -= 40;
  }
  
  yPos -= 20;
  page.drawText('Comparable Listings', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: boldFont,
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
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText('Price', {
    x: startX + columnWidths[0],
    y: yPos,
    size: normalFontSize,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText('Date', {
    x: startX + columnWidths[0] + columnWidths[1],
    y: yPos,
    size: normalFontSize,
    font: boldFont,
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
        font: boldFont,
        color: rgb(0, 0, 0.8)
      });
      
      yPos -= 50;
      
      // Redraw table headers
      page.drawText('Source', {
        x: startX,
        y: yPos,
        size: normalFontSize,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      page.drawText('Price', {
        x: startX + columnWidths[0],
        y: yPos,
        size: normalFontSize,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      page.drawText('Date', {
        x: startX + columnWidths[0] + columnWidths[1],
        y: yPos,
        size: normalFontSize,
        font: boldFont,
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
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(`$${comp.price.toLocaleString()}`, {
      x: startX + columnWidths[0],
      y: yPos,
      size: normalFontSize,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(comp.date, {
      x: startX + columnWidths[0] + columnWidths[1],
      y: yPos,
      size: normalFontSize,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    
    yPos -= 20;
  }
  
  return { page, yPos };
}
