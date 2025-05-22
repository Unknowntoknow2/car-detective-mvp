import type { DecodedVehicleInfo } from '@/types/vehicle';
import { ReportData } from './pdf/types';

export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  explanation?: string;
  generatedAt?: string;
  vin?: string;
  zipCode?: string;
  aiCondition?: any;
  isPremium?: boolean;
}

export function convertVehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo, 
  additionalData: {
    mileage: number,
    estimatedValue: number,
    condition: string,
    zipCode: string,
    confidenceScore?: number,
    adjustments?: any[],
    aiCondition?: any,
    isPremium?: boolean
  }
): ReportData {
  return {
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: additionalData.mileage,
    condition: additionalData.condition,
    estimatedValue: additionalData.estimatedValue,
    confidenceScore: additionalData.confidenceScore,
    zipCode: additionalData.zipCode,
    adjustments: additionalData.adjustments || [],
    aiCondition: additionalData.aiCondition,
    isPremium: additionalData.isPremium,
    vin: vehicleInfo.vin,
    generatedAt: new Date().toISOString(),
    priceRange: [
      Math.floor(additionalData.estimatedValue * 0.95),
      Math.ceil(additionalData.estimatedValue * 1.05)
    ]
  };
}

export async function downloadPdf(reportData: ReportData): Promise<void> {
  console.log('Generating PDF with data:', reportData);
  
  // Ensure priceRange is in tuple format
  if (reportData.priceRange && !Array.isArray(reportData.priceRange)) {
    // This should not happen with our new types, but just in case
    const min = 'min' in reportData.priceRange ? reportData.priceRange.min : reportData.estimatedValue * 0.95;
    const max = 'max' in reportData.priceRange ? reportData.priceRange.max : reportData.estimatedValue * 1.05;
    reportData.priceRange = [Number(min), Number(max)];
  }
  
  // Mock PDF generation for now (will be replaced with real PDF generation)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock PDF data URL (in a real app, this would be the actual PDF)
  const mockPdfUrl = URL.createObjectURL(
    new Blob(['Mock PDF content'], { type: 'application/pdf' })
  );
  
  // Create a download link and click it
  const link = document.createElement('a');
  link.href = mockPdfUrl;
  link.download = `${reportData.year}_${reportData.make}_${reportData.model}_valuation.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(mockPdfUrl), 100);
  
  return Promise.resolve();
}
