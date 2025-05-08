
import { ReportData, SectionParams } from '../types';

export function drawVehicleInfoSection(
  params: SectionParams, 
  reportData: ReportData, 
  yPosition: number
): number {
  const { page, regularFont, boldFont, margin, width } = params;
  
  // Draw section header
  page.drawText('Vehicle Information', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: { r: 0.1, g: 0.1, b: 0.1 }
  });
  yPosition -= 25;
  
  // Draw vehicle name
  const vehicleName = `${reportData.year} ${reportData.make} ${reportData.model}`;
  page.drawText(vehicleName, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: { r: 0.2, g: 0.2, b: 0.2 }
  });
  yPosition -= 20;
  
  // Draw VIN if available
  if (reportData.vin) {
    page.drawText(`VIN: ${reportData.vin}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: { r: 0.4, g: 0.4, b: 0.4 }
    });
    yPosition -= 20;
  }
  
  // Create two columns for vehicle details
  const col1X = margin;
  const col2X = margin + (width - margin * 2) / 2;
  let leftColY = yPosition;
  let rightColY = yPosition;
  
  // Left column details
  leftColY = drawDetailRow(page, 'Mileage:', formatMileage(reportData.mileage), col1X, leftColY, regularFont, boldFont);
  leftColY = drawDetailRow(page, 'Condition:', reportData.condition, col1X, leftColY, regularFont, boldFont);
  leftColY = drawDetailRow(page, 'Location:', reportData.zipCode, col1X, leftColY, regularFont, boldFont);
  
  // Optional left column details
  if (reportData.trim) {
    leftColY = drawDetailRow(page, 'Trim:', reportData.trim, col1X, leftColY, regularFont, boldFont);
  }
  
  // Right column details
  if (reportData.fuelType) {
    rightColY = drawDetailRow(page, 'Fuel Type:', reportData.fuelType, col2X, rightColY, regularFont, boldFont);
  }
  
  if (reportData.transmission) {
    rightColY = drawDetailRow(page, 'Transmission:', reportData.transmission, col2X, rightColY, regularFont, boldFont);
  }
  
  if (reportData.color) {
    rightColY = drawDetailRow(page, 'Exterior Color:', reportData.color, col2X, rightColY, regularFont, boldFont);
  }
  
  if (reportData.bodyType) {
    rightColY = drawDetailRow(page, 'Body Type:', reportData.bodyType, col2X, rightColY, regularFont, boldFont);
  }
  
  // Return the lower of the two Y positions
  return Math.min(leftColY, rightColY) - 20;
}

function drawDetailRow(
  page: any,
  label: string,
  value: string | number,
  x: number,
  y: number,
  regularFont: any,
  boldFont: any
): number {
  // Draw label
  page.drawText(label, {
    x,
    y,
    size: 12,
    font: boldFont,
    color: { r: 0.4, g: 0.4, b: 0.4 }
  });
  
  // Draw value
  page.drawText(String(value), {
    x: x + 100,
    y,
    size: 12,
    font: regularFont,
    color: { r: 0.2, g: 0.2, b: 0.2 }
  });
  
  return y - 20;
}

function formatMileage(mileage: string | number): string {
  if (typeof mileage === 'number') {
    return mileage.toLocaleString() + ' mi';
  } else {
    const numMileage = parseInt(mileage, 10);
    if (!isNaN(numMileage)) {
      return numMileage.toLocaleString() + ' mi';
    }
    return mileage;
  }
}
