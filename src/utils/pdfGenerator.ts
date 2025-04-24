
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PlateLookupInfo } from '@/types/lookup';
import { DecodedVehicleInfo } from '@/types/vehicle';

export interface ReportData {
  vin?: string;
  plate?: string;
  state?: string;
  make: string;
  model: string;
  year: number | string;
  mileage: string;
  fuelType?: string;
  condition?: string;
  zipCode?: string;
  color?: string;
  estimatedValue: string;
}

// Helper function to convert vehicle info to report data
export function convertVehicleInfoToReportData(info: DecodedVehicleInfo | PlateLookupInfo, additionalData?: {
  mileage?: string;
  estimatedValue?: string;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
}): ReportData {
  // Default values for required fields
  const estimatedValue = additionalData?.estimatedValue || "Not available";
  const mileage = additionalData?.mileage || "Not available";
  
  // Basic properties common to both types
  const reportData: ReportData = {
    make: info.make || "Not specified",
    model: info.model || "Not specified",
    year: info.year || "Not specified",
    mileage,
    estimatedValue,
    condition: additionalData?.condition || "Not specified",
    fuelType: additionalData?.fuelType || "Not specified",
    zipCode: additionalData?.zipCode || "Not specified",
  };

  // Add specific fields for vehicle info type
  if ('vin' in info) {
    reportData.vin = info.vin;
  }
  
  if ('plate' in info && 'state' in info) {
    reportData.plate = info.plate;
    reportData.state = info.state;
  }
  
  if ('color' in info) {
    reportData.color = info.color || "Not specified";
  }

  return reportData;
}

export async function downloadPdf(vehicleInfo: DecodedVehicleInfo | PlateLookupInfo | ReportData, additionalData?: {
  mileage?: string;
  estimatedValue?: string;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
}) {
  // Convert to ReportData if needed
  const reportData: ReportData = 'mileage' in vehicleInfo && 'estimatedValue' in vehicleInfo
    ? vehicleInfo as ReportData
    : convertVehicleInfoToReportData(vehicleInfo as any, additionalData);

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
  drawTextPair('Estimated Value', `$${reportData.estimatedValue}`);

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
