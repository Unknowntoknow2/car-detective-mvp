
import { PDFPage, rgb } from 'pdf-lib';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { PdfFonts, PdfConstants } from '../components/pdfCommon';

/**
 * Draw vehicle details section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawVehicleDetailsSection(
  page: PDFPage, 
  vehicle: DecodedVehicleInfo,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, headingFontSize, normalFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Vehicle details section header
  page.drawText('Vehicle Information', {
    x: margin,
    y: yPos,
    size: headingFontSize,
    font: boldFont,
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
    { label: 'Color:', value: vehicle.color || vehicle.exteriorColor || 'N/A' },
  ];
  
  for (const detail of vehicleDetails) {
    page.drawText(detail.label, {
      x: margin,
      y: yPos,
      size: normalFontSize,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(detail.value, {
      x: margin + 100,
      y: yPos,
      size: normalFontSize,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    
    yPos -= 20;
  }
  
  return yPos;
}
