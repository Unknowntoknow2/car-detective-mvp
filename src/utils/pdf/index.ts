
import { ReportData, PdfOptions } from './types';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { generateValuationPdf, downloadValuationPdf } from './generateValuationPdf';

export { ReportData, PdfOptions } from './types';

export async function downloadPdf(data: ReportData, options: PdfOptions = {}): Promise<void> {
  return downloadValuationPdf(data, options);
}

export async function generatePdf(data: ReportData, options: PdfOptions = {}): Promise<Uint8Array> {
  return generateValuationPdf(data, options);
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
    vin: vehicleInfo.vin || '',
    make: vehicleInfo.make || '',
    model: vehicleInfo.model || '',
    year: vehicleInfo.year || new Date().getFullYear(),
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

// Re-export the main functions
export { generateValuationPdf, downloadValuationPdf };
