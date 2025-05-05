
import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont, Color } from 'pdf-lib';

export interface PdfFonts {
  regular: PDFFont;
  bold: PDFFont;
}

export interface PdfConstants {
  margin: number;
  width: number;
  height: number;
  titleFontSize: number;
  headingFontSize: number;
  normalFontSize: number;
  smallFontSize: number;
}

/**
 * Initialize PDF document and load fonts
 */
export async function initializePdf(): Promise<{
  pdfDoc: PDFDocument;
  page: PDFPage;
  fonts: PdfFonts;
  constants: PdfConstants;
}> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Define layout constants
  const constants: PdfConstants = {
    margin: 50,
    width,
    height,
    titleFontSize: 24,
    headingFontSize: 16,
    normalFontSize: 12,
    smallFontSize: 10
  };
  
  return {
    pdfDoc,
    page,
    fonts: {
      regular: regularFont,
      bold: boldFont
    },
    constants
  };
}

/**
 * Draw a horizontal line on the page
 */
export function drawHorizontalLine(
  page: PDFPage, 
  startX: number, 
  endX: number, 
  y: number, 
  thickness: number = 1, 
  color: Color = rgb(0.8, 0.8, 0.8)
): void {
  page.drawLine({
    start: { x: startX, y },
    end: { x: endX, y },
    thickness,
    color,
  });
}

/**
 * Draw a section heading
 * Returns the new y position after drawing
 */
export function drawSectionHeading(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  font: PDFFont,
  color: Color = rgb(0, 0, 0.8)
): number {
  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color
  });
  
  return y - fontSize - 10;
}
