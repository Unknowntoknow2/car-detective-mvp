
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PlateLookupInfo } from '@/types/lookup';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { CarfaxData } from './carfax/mockCarfaxService';

export interface ReportData {
  make: string;
  model: string;
  year: number | string;
  mileage: number | string;
  vin?: string;
  plate?: string;
  state?: string;
  color?: string;
  estimatedValue: number;
  fuelType?: string;
  condition?: string;
  location?: string;
  transmission?: string;
  zipCode?: string;
  confidenceScore?: number;
  adjustments?: { label: string; value: number }[];
  carfaxData?: CarfaxData; // Add CARFAX data
  isPremium?: boolean; // Flag to determine if this is a premium report
}

export function convertVehicleInfoToReportData(
  vehicle: Partial<DecodedVehicleInfo | PlateLookupInfo>, 
  valuationData?: {
    mileage?: number | string;
    estimatedValue?: number;
    confidenceScore?: number;
    condition?: string;
    adjustments?: { label: string; value: number }[];
    zipCode?: string;
    fuelType?: string;
    carfaxData?: CarfaxData;
    isPremium?: boolean;
  }
): ReportData {
  const defaultData = {
    mileage: "Unknown",
    estimatedValue: 0,
    confidenceScore: 0,
    condition: "Not Specified",
    fuelType: "Not Specified",
    zipCode: "Not Available"
  };

  const mergedData = { ...defaultData, ...valuationData };

  const baseReportData: ReportData = {
    make: vehicle.make || 'Unknown',
    model: vehicle.model || 'Unknown',
    year: vehicle.year || 'Unknown',
    mileage: mergedData.mileage?.toString() || "Unknown",
    estimatedValue: typeof mergedData.estimatedValue === 'number' ? mergedData.estimatedValue : 0,
    condition: mergedData.condition,
    fuelType: mergedData.fuelType,
    zipCode: mergedData.zipCode,
    confidenceScore: mergedData.confidenceScore,
    adjustments: mergedData.adjustments || [],
    carfaxData: mergedData.carfaxData,
    isPremium: mergedData.isPremium
  };

  if ('vin' in vehicle) {
    baseReportData.vin = vehicle.vin;
  }

  if ('plate' in vehicle && 'state' in vehicle) {
    baseReportData.plate = vehicle.plate;
    baseReportData.state = vehicle.state;
  }

  if ('color' in vehicle) {
    baseReportData.color = vehicle.color || undefined;
  }

  if ('transmission' in vehicle) {
    baseReportData.transmission = vehicle.transmission || undefined;
  }

  return baseReportData;
}

export async function downloadPdf(vehicleInfo: DecodedVehicleInfo | PlateLookupInfo | ReportData, additionalData?: {
  mileage?: number | string;
  estimatedValue?: number;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
  confidenceScore?: number;
  confidenceLevel?: string;
}) {
  const reportData: ReportData = 'mileage' in vehicleInfo && 'estimatedValue' in vehicleInfo
    ? vehicleInfo as ReportData
    : convertVehicleInfoToReportData(vehicleInfo as any, additionalData as any);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.12, 0.46, 0.70);
  const textColor = rgb(0, 0, 0);

  const margin = 50;

  // Add premium indicator if applicable
  if (reportData.isPremium) {
    page.drawText('PREMIUM REPORT', {
      x: width - 150,
      y: height - margin,
      size: 12,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2),
    });
  }

  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: height - margin,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });

  let yPosition = height - margin - 50;
  const labelFontSize = 12;
  const valueFontSize = 14;

  const drawTextPair = (label: string, value: string) => {
    page.drawText(label, {
      x: margin,
      y: yPosition,
      size: labelFontSize,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(value, {
      x: width / 2,
      y: yPosition,
      size: valueFontSize,
      font: boldFont,
      color: textColor,
    });

    yPosition -= 30;
  };

  drawTextPair('Vehicle', `${reportData.year} ${reportData.make} ${reportData.model}`);
  if (reportData.vin) {
    drawTextPair('VIN', reportData.vin);
  } else if (reportData.plate && reportData.state) {
    drawTextPair('License Plate', `${reportData.plate} (${reportData.state})`);
  }
  drawTextPair('Mileage', `${reportData.mileage} miles`);
  if (reportData.condition) {
    drawTextPair('Condition', reportData.condition);
  }
  if (reportData.zipCode) {
    drawTextPair('Location', `ZIP: ${reportData.zipCode}`);
  }
  if (reportData.color) {
    drawTextPair('Color', reportData.color);
  }

  yPosition -= 20;
  page.drawText('Valuation Details', {
    x: margin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: primaryColor,
  });

  yPosition -= 30;
  drawTextPair('Estimated Value', `$${reportData.estimatedValue.toLocaleString()}`);
  
  if (reportData.confidenceScore) {
    drawTextPair('Confidence Score', `${reportData.confidenceScore}%`);
  }

  // Add CARFAX details if available
  if (reportData.carfaxData) {
    yPosition -= 20;
    page.drawText('Vehicle History (CARFAX)', {
      x: margin,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: primaryColor,
    });
    
    yPosition -= 30;
    
    const carfax = reportData.carfaxData;
    drawTextPair('Accident Reports', carfax.accidentsReported > 0 
      ? `${carfax.accidentsReported} (${carfax.damageSeverity || 'minor'} damage)` 
      : 'None reported');
    drawTextPair('Previous Owners', carfax.owners.toString());
    drawTextPair('Service Records', carfax.serviceRecords.toString());
    
    if (carfax.salvageTitle) {
      drawTextPair('Title Status', carfax.brandedTitle || 'Salvage/Branded');
    } else {
      drawTextPair('Title Status', 'Clean');
    }
  }

  yPosition -= 50;
  page.drawText('Disclaimer: This valuation is for informational purposes only.', {
    x: margin,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  if (reportData.isPremium) {
    yPosition -= 20;
    page.drawText('This premium report includes verified vehicle history data.', {
      x: margin,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `vehicle_valuation_${reportData.year}_${reportData.make}_${reportData.model}${reportData.isPremium ? '_premium' : ''}.pdf`;
  link.click();
}
