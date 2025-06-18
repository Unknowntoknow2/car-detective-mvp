
import { ReportData, PdfOptions } from './types';
import { DecodedVehicleInfo } from '@/types/vehicle';

export { ReportData, PdfOptions } from './types';

export async function downloadPdf(data: ReportData, options: PdfOptions = {}): Promise<void> {
  // Mock PDF download implementation
  console.log('Downloading PDF for:', data.make, data.model, data.year);
  
  // Create a mock PDF blob
  const pdfContent = `
    Vehicle Valuation Report
    ${data.year} ${data.make} ${data.model}
    Estimated Value: $${data.estimatedValue.toLocaleString()}
    Confidence Score: ${data.confidenceScore}%
    Generated: ${data.generatedAt}
  `;
  
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `ValuationReport_${data.make}_${data.model}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generatePdf(data: ReportData, options: PdfOptions = {}): Promise<Uint8Array> {
  // Mock PDF generation
  const pdfContent = `PDF content for ${data.make} ${data.model}`;
  return new Uint8Array(Buffer.from(pdfContent, 'utf-8'));
}

export function convertVehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo,
  valuationData: {
    mileage: number;
    estimatedValue: number;
    condition: string;
    zipCode: string;
    confidenceScore: number;
    adjustments: any[];
    isPremium?: boolean;
  }
): ReportData {
  return {
    id: Date.now().toString(),
    vin: vehicleInfo.vin,
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    trim: vehicleInfo.trim,
    mileage: valuationData.mileage,
    condition: valuationData.condition,
    estimatedValue: valuationData.estimatedValue,
    price: valuationData.estimatedValue,
    priceRange: [
      Math.floor(valuationData.estimatedValue * 0.95),
      Math.ceil(valuationData.estimatedValue * 1.05)
    ],
    confidenceScore: valuationData.confidenceScore,
    zipCode: valuationData.zipCode,
    adjustments: valuationData.adjustments,
    generatedAt: new Date().toISOString(),
    isPremium: valuationData.isPremium || false,
    color: vehicleInfo.color,
    bodyType: vehicleInfo.bodyType,
    fuelType: vehicleInfo.fuelType
  };
}

export async function downloadValuationPdf(data: ReportData): Promise<void> {
  return downloadPdf(data);
}
