
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PlateLookupInfo } from '@/types/lookup';
import { DecodedVehicleInfo } from '@/types/vehicle';

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
  }
): ReportData {
  const defaultData = {
    mileage: "Unknown",
    estimatedValue: 0, // Changed from "Not Available" to 0 to match number type
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
    estimatedValue: typeof mergedData.estimatedValue === 'number' ? mergedData.estimatedValue : 0, // Ensure we always have a number
    condition: mergedData.condition,
    fuelType: mergedData.fuelType,
    zipCode: mergedData.zipCode,
    confidenceScore: mergedData.confidenceScore,
    adjustments: mergedData.adjustments || []
  };

  // Add VIN-specific or Plate-specific details
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
}) {
  // Convert to ReportData if needed
  const reportData: ReportData = 'mileage' in vehicleInfo && 'estimatedValue' in vehicleInfo
    ? vehicleInfo as ReportData
    : convertVehicleInfoToReportData(vehicleInfo as any, additionalData as any);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Set up colors
  const primaryColor = rgb(0.12, 0.46, 0.70); // Blue
  const textColor = rgb(0, 0, 0); // Black

  // Page margins
  const margin = 50;

  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: height - margin,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });

  // Vehicle Details Section
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

  // Detailed sections
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

  // Valuation Section
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

  // Disclaimer
  yPosition -= 50;
  page.drawText('Disclaimer: This valuation is for informational purposes only.', {
    x: margin,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Serialize PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Create a blob and trigger download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `vehicle_valuation_${reportData.year}_${reportData.make}_${reportData.model}.pdf`;
  link.click();
}
