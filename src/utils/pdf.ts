
import { DecodedVehicleInfo } from '@/types/vehicle';

export function generateValuationPDF(vehicle: DecodedVehicleInfo) {
  // Ensure required properties are available with fallbacks
  const vehicleData = {
    make: vehicle.make || 'Unknown',
    model: vehicle.model || 'Unknown', 
    year: vehicle.year || new Date().getFullYear(),
    mileage: vehicle.mileage || 0,
    condition: vehicle.condition || 'Unknown',
    estimatedValue: vehicle.estimatedValue || 0,
    vin: vehicle.vin || 'N/A',
    trim: vehicle.trim || 'Standard',
    engine: vehicle.engine || 'N/A',
    transmission: vehicle.transmission || 'N/A',
    bodyType: vehicle.bodyType || 'N/A',
    fuelType: vehicle.fuelType || 'N/A',
    drivetrain: vehicle.drivetrain || 'N/A',
    exteriorColor: vehicle.exteriorColor || vehicle.color || 'N/A',
    interiorColor: vehicle.interiorColor || 'N/A',
    confidenceScore: vehicle.confidenceScore || 0,
    features: vehicle.features || []
  };
  
  console.log('Generating PDF for vehicle:', vehicleData);
  
  // Return a promise that resolves with the PDF data URL
  return Promise.resolve(`data:application/pdf;base64,${btoa('PDF content would be here')}`);
}

export interface ValuationReportInput {
  mileage: number;
  estimatedValue: number;
  confidenceScore: number;
  condition: string;
  zipCode: string;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  isPremium?: boolean;
}

export interface ReportData {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode: string;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  generatedAt: string;
  transmission?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  bodyStyle?: string;
  photoUrl?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
  } | null;
  isPremium?: boolean;
  priceRange?: [number, number];
}

/**
 * Convert vehicle info to report data
 */
export function convertVehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo, 
  valuationData: ValuationReportInput
): ReportData {
  // Make sure adjustments have a description
  const formattedAdjustments = valuationData.adjustments.map(adj => ({
    factor: adj.factor,
    impact: adj.impact,
    description: adj.description || `Adjustment for ${adj.factor}`
  }));
  
  const reportData: ReportData = {
    // Vehicle information
    make: vehicleInfo.make || 'Unknown',
    model: vehicleInfo.model || 'Unknown',
    year: vehicleInfo.year || new Date().getFullYear(),
    vin: vehicleInfo.vin,
    mileage: valuationData.mileage,
    condition: valuationData.condition || 'Good',
    
    // Valuation information
    estimatedValue: valuationData.estimatedValue,
    confidenceScore: valuationData.confidenceScore,
    
    // Location information
    zipCode: valuationData.zipCode,
    
    // Condition information
    aiCondition: {
      condition: valuationData.condition,
      confidenceScore: valuationData.confidenceScore,
      issuesDetected: [],
      summary: `Vehicle is in ${valuationData.condition} condition.`
    },
    
    // Additional information
    adjustments: formattedAdjustments,
    isPremium: valuationData.isPremium,
    generatedAt: new Date().toISOString()
  };
  
  return reportData;
}

/**
 * Download a PDF for the valuation report
 */
export async function downloadPdf(
  data: ReportData,
  options: { isPremium?: boolean } = {}
): Promise<void> {
  try {
    console.log('Downloading PDF for vehicle:', data);
    
    // Create a blob from mock PDF data
    const mockPdfContent = `PDF Report for ${data.year} ${data.make} ${data.model}`;
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    
    // Create a sanitized filename
    const sanitizedMake = data.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
    const sanitizedModel = data.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
    const filename = `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${Date.now()}.pdf`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading valuation PDF:', error);
    throw error;
  }
}
