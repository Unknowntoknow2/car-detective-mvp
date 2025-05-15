
import { PDFPage, rgb } from 'pdf-lib';
import { ReportData, SectionParams } from '../types';

export const drawVehicleInfoSection = (
  params: SectionParams,
  reportData: ReportData
): number => {
  const { page, y, margin, width, regularFont, boldFont } = params;
  let currentY = y - 20;
  
  // Draw section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 30;
  
  // Draw make and model
  page.drawText('Make / Model:', {
    x: margin,
    y: currentY,
    size: 11,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText(`${reportData.make} ${reportData.model}`, {
    x: margin + width / 3,
    y: currentY,
    size: 11,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 20;
  
  // Draw year
  page.drawText('Year:', {
    x: margin,
    y: currentY,
    size: 11,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText(`${reportData.year}`, {
    x: margin + width / 3,
    y: currentY,
    size: 11,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  currentY -= 20;
  
  // Draw mileage if available
  if (reportData.mileage) {
    page.drawText('Mileage:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(`${reportData.mileage.toLocaleString()} miles`, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    
    currentY -= 20;
  }
  
  // Draw vin if available
  if (reportData.vin) {
    page.drawText('VIN:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(reportData.vin, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    
    currentY -= 20;
  }
  
  // Draw condition if available
  if (reportData.condition) {
    page.drawText('Condition:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(reportData.condition, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    
    currentY -= 20;
  }
  
  // Draw color if available
  if (reportData.color) {
    page.drawText('Color:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(reportData.color, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    
    currentY -= 20;
  }
  
  // Draw fuel type if available
  if (reportData.fuelType) {
    page.drawText('Fuel Type:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(reportData.fuelType, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    
    currentY -= 20;
  }
  
  // Draw transmission if available
  if (reportData.transmission) {
    page.drawText('Transmission:', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(reportData.transmission, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    
    currentY -= 20;
  }
  
  return currentY;
};
