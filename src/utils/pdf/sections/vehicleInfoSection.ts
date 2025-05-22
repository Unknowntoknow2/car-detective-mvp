
import { SectionParams } from '../types';

export function drawVehicleInfoSection(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw section title
  page.drawText('Vehicle Information', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw vehicle name
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  y -= 20;
  
  // Draw vehicle details in a table format
  const drawDetail = (label: string, value: string) => {
    page.drawText(label, {
      x: margin,
      y,
      size: 9,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(value, {
      x: margin + 120,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  };
  
  // Mileage
  if (data.mileage) {
    drawDetail('Mileage:', `${data.mileage.toLocaleString()} miles`);
  }
  
  // VIN
  if (data.vin) {
    drawDetail('VIN:', data.vin);
  }
  
  // Condition
  if (data.condition) {
    drawDetail('Condition:', data.condition);
  }
  
  // Location
  if (data.zipCode) {
    drawDetail('Location:', `ZIP: ${data.zipCode}`);
  }
  
  y -= 10; // Add some space after the table
  
  return y; // Return the new Y position
}
