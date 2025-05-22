import { SectionParams } from '../types';
import { safeString } from './sectionHelper';

export const drawVehicleInfoSection = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  let currentY = doc.y + 20;
  
  // Draw section title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Vehicle Information', margin, currentY);
  
  currentY += 30;
  
  // Draw vehicle information table
  const vehicleInfo = [
    { label: 'Make', value: safeString(data.make) },
    { label: 'Model', value: safeString(data.model) },
    { label: 'Year', value: safeString(data.year) },
    { label: 'Trim', value: safeString(data.trim) },
    { label: 'VIN', value: safeString(data.vin) },
    { label: 'Mileage', value: data.mileage ? `${data.mileage.toLocaleString()} miles` : 'N/A' },
    { label: 'Body Type', value: safeString(data.bodyType) },
    { label: 'Color', value: safeString(data.color) },
    { label: 'Fuel Type', value: safeString(data.fuelType) },
    { label: 'Transmission', value: safeString(data.transmission) }
  ];
  
  // Draw each info row
  vehicleInfo.forEach(item => {
    if (item.value) {
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#666666')
         .text(item.label + ':', margin, currentY);
      
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text(item.value, margin + 100, currentY);
      
      currentY += 18;
    }
  });
  
  return currentY + 10;
};
