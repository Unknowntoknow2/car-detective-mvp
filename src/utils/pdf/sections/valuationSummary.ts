
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export async function addValuationSummary(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY - 150;
  const textColor = params.textColor || rgb(0.1, 0.1, 0.1);
  const primaryColor = params.primaryColor || rgb(0.2, 0.4, 0.8);
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y,
    size: 18,
    font: fonts.bold,
    color: textColor,
  });
  
  let currentY = y - 40;
  
  // Draw estimated value in large font
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.regular,
    color: textColor,
  });
  
  const estimatedValueText = `$${data.estimatedValue.toLocaleString()}`;
  
  page.drawText(estimatedValueText, {
    x: margin + 120,
    y: currentY,
    size: 16,
    font: fonts.bold,
    color: rgb(0.2, 0.6, 0.3),
  });
  
  currentY -= 30;
  
  // Draw confidence score
  page.drawText('Confidence Score:', {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.regular,
    color: textColor,
  });
  
  page.drawText(`${data.confidenceScore}%`, {
    x: margin + 120,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 30;
  
  // Draw price range if available
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    const priceRange = data.priceRange as [number, number];
    
    page.drawText('Value Range:', {
      x: margin,
      y: currentY,
      size: 12,
      font: fonts.regular,
      color: textColor,
    });
    
    const rangeText = `$${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`;
    
    page.drawText(rangeText, {
      x: margin + 120,
      y: currentY,
      size: 12,
      font: fonts.bold,
      color: textColor,
    });
    
    currentY -= 30;
  }
  
  // Draw vehicle details
  page.drawText('Vehicle Details', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 25;
  
  // Draw make/model/year
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Draw additional details in two columns
  const col1X = margin;
  const col2X = margin + 200;
  
  // Column 1
  page.drawText('Mileage:', {
    x: col1X,
    y: currentY,
    size: 10,
    font: fonts.regular,
    color: textColor,
  });
  
  page.drawText(`${data.mileage.toLocaleString()} miles`, {
    x: col1X + 80,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  // Column 2
  page.drawText('Condition:', {
    x: col2X,
    y: currentY,
    size: 10,
    font: fonts.regular,
    color: textColor,
  });
  
  page.drawText(data.condition, {
    x: col2X + 80,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Row 2
  if (data.vin) {
    page.drawText('VIN:', {
      x: col1X,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    page.drawText(data.vin, {
      x: col1X + 80,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
  }
  
  if (data.zipCode) {
    page.drawText('Location:', {
      x: col2X,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    page.drawText(data.zipCode, {
      x: col2X + 80,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
  }
  
  currentY -= 20;
  
  // Row 3 - additional data if available
  if (data.transmission) {
    page.drawText('Transmission:', {
      x: col1X,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    page.drawText(data.transmission, {
      x: col1X + 80,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
  }
  
  if (data.fuelType) {
    page.drawText('Fuel Type:', {
      x: col2X,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    page.drawText(data.fuelType, {
      x: col2X + 80,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
  }
  
  return currentY - 30;
}
