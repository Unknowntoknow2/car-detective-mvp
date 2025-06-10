
export { ReportData } from './types';
export * from './generateValuationPdf';

// Add downloadPdf function
export async function downloadPdf(reportData: ReportData): Promise<void> {
  try {
    // Create a mock PDF blob for now
    const pdfContent = `
Vehicle Valuation Report
${reportData.year} ${reportData.make} ${reportData.model}
Estimated Value: $${reportData.estimatedValue.toLocaleString()}
Confidence Score: ${reportData.confidenceScore}%
Generated: ${reportData.generatedAt}
    `;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `valuation-report-${reportData.make}-${reportData.model}-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

// Add convertVehicleInfoToReportData function
export function convertVehicleInfoToReportData(
  vehicleInfo: any, 
  valuationData: any
): ReportData {
  return {
    id: Date.now().toString(),
    make: vehicleInfo.make || 'Unknown',
    model: vehicleInfo.model || 'Unknown',
    year: vehicleInfo.year || new Date().getFullYear(),
    mileage: valuationData.mileage || 0,
    condition: valuationData.condition || 'Good',
    estimatedValue: valuationData.estimatedValue || 0,
    price: valuationData.estimatedValue || 0,
    priceRange: valuationData.priceRange || [0, 0],
    confidenceScore: valuationData.confidenceScore || 0,
    zipCode: valuationData.zipCode || '',
    adjustments: valuationData.adjustments || [],
    generatedAt: new Date().toISOString(),
    vin: vehicleInfo.vin,
    isPremium: valuationData.isPremium || false,
    aiCondition: valuationData.aiCondition
  };
}
