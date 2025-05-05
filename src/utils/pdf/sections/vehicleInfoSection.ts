
import { PDFPage, rgb } from 'pdf-lib';
import { ReportData } from '../types';
import { PdfFonts, PdfConstants, drawHorizontalLine, drawSectionHeading } from '../components/pdfCommon';
import { drawTextPair } from '../helpers/pdfHelpers';

/**
 * Draw vehicle information section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawVehicleInfoSection(
  page: PDFPage,
  data: ReportData,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, width, headingFontSize } = constants;
  const { regular, bold } = fonts;
  
  let currentY = yPos;
  
  // Draw section header
  currentY = drawSectionHeading(
    page, 
    'Vehicle Information', 
    margin, 
    currentY, 
    headingFontSize, 
    bold,
    rgb(0.1, 0.1, 0.8)
  );
  
  // Draw section container background
  page.drawRectangle({
    x: margin - 10,
    y: currentY - 130,  // Approximate height needed for content
    width: width - (margin * 2) + 20,
    height: 140,
    color: rgb(0.96, 0.96, 1),
    borderColor: rgb(0.8, 0.8, 0.9),
    borderWidth: 1,
    borderOpacity: 0.5,
  });
  
  currentY -= 15;
  
  // Draw make & model
  drawTextPair(
    page,
    'Make & Model:',
    `${data.make} ${data.model}`,
    { font: regular, boldFont: bold, yPosition: currentY, margin: margin + 10, width, labelColor: rgb(0.4, 0.4, 0.4) }
  );
  currentY -= 25;
  
  // Draw year
  drawTextPair(
    page,
    'Year:',
    `${data.year}`,
    { font: regular, boldFont: bold, yPosition: currentY, margin: margin + 10, width, labelColor: rgb(0.4, 0.4, 0.4) }
  );
  currentY -= 25;
  
  // Draw mileage
  drawTextPair(
    page,
    'Mileage:',
    `${data.mileage.toLocaleString()} miles`,
    { font: regular, boldFont: bold, yPosition: currentY, margin: margin + 10, width, labelColor: rgb(0.4, 0.4, 0.4) }
  );
  currentY -= 25;
  
  // Draw body type & fuel type
  drawTextPair(
    page,
    'Body Type:',
    `${data.bodyType || data.bodyStyle || 'Not Specified'}`,
    { font: regular, boldFont: bold, yPosition: currentY, margin: margin + 10, width, labelColor: rgb(0.4, 0.4, 0.4) }
  );
  currentY -= 25;
  
  // Draw fuel type
  drawTextPair(
    page,
    'Fuel Type:',
    `${data.fuelType || 'Not Specified'}`,
    { font: regular, boldFont: bold, yPosition: currentY, margin: margin + 10, width, labelColor: rgb(0.4, 0.4, 0.4) }
  );
  currentY -= 25;
  
  // Draw ZIP code
  drawTextPair(
    page,
    'Location:',
    `${data.zipCode || 'Not Specified'}`,
    { font: regular, boldFont: bold, yPosition: currentY, margin: margin + 10, width, labelColor: rgb(0.4, 0.4, 0.4) }
  );
  
  // Return the updated y position
  return currentY - 15;
}
