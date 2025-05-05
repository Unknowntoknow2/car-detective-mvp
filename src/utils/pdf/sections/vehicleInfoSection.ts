
import { PDFPage, rgb, PDFFont } from 'pdf-lib';
import { drawTextPair } from '../helpers/pdfHelpers';

/**
 * Draw vehicle information section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawVehicleInfoSection(
  vehicle: {
    year: number | string;
    make: string;
    model: string;
    vin?: string;
    plate?: string;
    state?: string;
    mileage: number | string;
    condition?: string;
    zipCode?: string;
  },
  page: PDFPage,
  yPosition: number,
  margin: number,
  width: number,
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  }
): number {
  let currentY = yPosition;
  const { regular, bold } = fonts;
  
  // Draw vehicle information
  drawTextPair(page, 'Vehicle', `${vehicle.year} ${vehicle.make} ${vehicle.model}`, { 
    font: regular, 
    boldFont: bold, 
    yPosition: currentY, 
    margin, 
    width 
  });
  currentY -= 30;
  
  if (vehicle.vin && vehicle.vin !== 'Unknown' && vehicle.vin !== '') {
    drawTextPair(page, 'VIN', vehicle.vin, { 
      font: regular, 
      boldFont: bold, 
      yPosition: currentY, 
      margin, 
      width 
    });
    currentY -= 30;
  } else if (vehicle.plate && vehicle.state) {
    drawTextPair(page, 'License Plate', `${vehicle.plate} (${vehicle.state})`, { 
      font: regular, 
      boldFont: bold, 
      yPosition: currentY, 
      margin, 
      width 
    });
    currentY -= 30;
  }
  
  drawTextPair(page, 'Mileage', `${vehicle.mileage} miles`, { 
    font: regular, 
    boldFont: bold, 
    yPosition: currentY, 
    margin, 
    width 
  });
  currentY -= 30;

  if (vehicle.condition) {
    drawTextPair(page, 'Condition', vehicle.condition, { 
      font: regular, 
      boldFont: bold, 
      yPosition: currentY, 
      margin, 
      width 
    });
    currentY -= 30;
  }

  if (vehicle.zipCode) {
    drawTextPair(page, 'Location', `ZIP: ${vehicle.zipCode}`, { 
      font: regular, 
      boldFont: bold, 
      yPosition: currentY, 
      margin, 
      width 
    });
    currentY -= 30;
  }
  
  return currentY;
}
