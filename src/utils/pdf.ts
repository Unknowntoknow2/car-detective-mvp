
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { ReportData as ReportDataType, AdjustmentItem } from './pdf/types';

// Don't redefine ReportData - instead use a type alias to avoid conflicts
export type ReportData = ReportDataType;

export function convertVehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo, 
  additionalData: {
    mileage: number,
    estimatedValue: number,
    condition: string,
    zipCode: string,
    confidenceScore?: number,
    adjustments?: AdjustmentItem[],
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
    confidenceScore: additionalData.confidenceScore || 0, // Provide default to avoid undefined
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
  
  // Ensure priceRange is always in tuple format [min, max]
  if (reportData.priceRange) {
    if (Array.isArray(reportData.priceRange)) {
      // Already a tuple, make sure it has two elements
      if (reportData.priceRange.length < 2) {
        reportData.priceRange = [
          Math.floor(reportData.estimatedValue * 0.95),
          Math.ceil(reportData.estimatedValue * 1.05)
        ];
      }
    } else if (typeof reportData.priceRange === 'object') {
      // Handle the object format with explicit type checking
      const priceObj = reportData.priceRange as any;
      
      if ('min' in priceObj && 'max' in priceObj) {
        reportData.priceRange = [Number(priceObj.min), Number(priceObj.max)];
      } else {
        // Fallback if the format is unexpected
        reportData.priceRange = [
          Math.floor(reportData.estimatedValue * 0.95),
          Math.ceil(reportData.estimatedValue * 1.05)
        ];
      }
    } else {
      // If it's neither an array nor an object, set a default
      reportData.priceRange = [
        Math.floor(reportData.estimatedValue * 0.95),
        Math.ceil(reportData.estimatedValue * 1.05)
      ];
    }
  } else {
    // If priceRange is undefined, calculate a default
    reportData.priceRange = [
      Math.floor(reportData.estimatedValue * 0.95),
      Math.ceil(reportData.estimatedValue * 1.05)
    ];
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
