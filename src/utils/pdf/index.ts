
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ReportData } from './types';

export async function downloadPdf(reportData: ReportData): Promise<Blob> {
  // Implement PDF generation and download
  // This is a placeholder implementation
  console.log('Generating PDF with data:', reportData);
  
  // Create a simple PDF (this would be replaced by actual PDF generation)
  const pdfContent = `
    Vehicle Valuation Report
    ${reportData.year} ${reportData.make} ${reportData.model}
    Estimated Value: $${reportData.estimatedValue}
    Generated: ${reportData.generatedAt}
  `;
  
  // Return a Blob with the PDF content
  return new Blob([pdfContent], { type: 'application/pdf' });
}

export function convertVehicleInfoToReportData(vehicleInfo: DecodedVehicleInfo, valuationData: any): ReportData {
  // Convert vehicle info and valuation data to report data format
  return {
    // Since DecodedVehicleInfo doesn't have an id property, use valuationData.id or generate a new UUID
    id: valuationData.id || crypto.randomUUID(),
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: valuationData.mileage || 0,
    condition: valuationData.condition || 'Good',
    zipCode: vehicleInfo.zipCode || valuationData.zipCode || '10001',
    // Required property for report data
    price: valuationData.price || valuationData.estimatedValue || 0,
    estimatedValue: valuationData.estimatedValue || 0,
    priceRange: [
      Math.floor((valuationData.estimatedValue || 0) * 0.95),
      Math.ceil((valuationData.estimatedValue || 0) * 1.05)
    ],
    adjustments: valuationData.adjustments?.map((adj: any) => ({
      factor: adj.factor || adj.name || '',
      impact: adj.impact || 0,
      description: adj.description || `Adjustment for ${adj.factor || adj.name || 'unknown'}`
    })) || [],
    generatedAt: new Date().toISOString(),
    confidenceScore: valuationData.confidenceScore,
    photoScore: valuationData.photoScore,
    bestPhotoUrl: valuationData.bestPhotoUrl,
    isPremium: valuationData.isPremium,
    aiCondition: valuationData.aiCondition,
    features: valuationData.features || [],
    explanation: valuationData.explanation || `Valuation for ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`
  };
}
