
export { generateValuationPdf, downloadValuationPdf } from './generateValuationPdf';
export { uploadValuationPdf } from './uploadValuationPdf';
export { pdfGeneratorService } from './pdfGeneratorService';
export * from './types';

// Helper function to convert vehicle info to report data
export function convertVehicleInfoToReportData(vehicleInfo: any, valuationData: any): any {
  return {
    id: vehicleInfo.id || Date.now().toString(),
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: valuationData.mileage,
    condition: valuationData.condition,
    estimatedValue: valuationData.estimatedValue,
    price: valuationData.estimatedValue,
    confidenceScore: valuationData.confidenceScore || 0,
    vin: vehicleInfo.vin,
    zipCode: valuationData.zipCode,
    adjustments: valuationData.adjustments || [],
    generatedAt: new Date().toISOString(),
    priceRange: valuationData.priceRange || [0, 0],
    isPremium: valuationData.isPremium || false
  };
}

// Export downloadPdf as alias for downloadValuationPdf
export const downloadPdf = downloadValuationPdf;
