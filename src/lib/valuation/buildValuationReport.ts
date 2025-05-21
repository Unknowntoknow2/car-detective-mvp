import { ValuationParams, ValuationResult } from '@/utils/valuation/types';
import { generatePdf } from '@/utils/pdf/pdfGenerator';
import { formatCurrency } from '@/utils/formatters';
import { getVehicleImageUrl } from '@/utils/vehicleImages';
import { uploadToS3 } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { calculateValuation } from '@/utils/valuation/calculator';

// Update the type to include 'photo'
type IdentifierType = 'vin' | 'plate' | 'manual' | 'photo';

// Extend ValuationParams to include the missing properties
interface ExtendedValuationParams extends ValuationParams {
  identifierType?: IdentifierType;
  isPremium?: boolean;
  vin?: string;
}

interface ValuationReportOptions {
  includeMarketAnalysis?: boolean;
  includeSimilarListings?: boolean;
  includeHistoricalData?: boolean;
  includeConditionDetails?: boolean;
  includeFeatureBreakdown?: boolean;
  includePriceAdjustments?: boolean;
  includePhotos?: boolean;
  includeCarfaxSummary?: boolean;
  customHeader?: string;
  customFooter?: string;
  logoUrl?: string;
  watermark?: string;
  colorScheme?: 'light' | 'dark' | 'branded';
}

// Update the return type to include all properties needed by tests
interface ValuationReportResult {
  pdfUrl: string;
  pdfBuffer: Buffer;
  // Include additional properties from the valuation result
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  photoScore?: number;
  bestPhotoUrl?: string;
  aiCondition?: any;
  explanation?: string;
  isPremium: boolean;
  adjustments?: any[];
  features?: string[];
  // Other properties that might be needed
  trim?: string;
  vin?: string;
  color?: string;
  zip?: string;
}

export async function buildValuationReport(
  params: ExtendedValuationParams,
  valuationResult: ValuationResult,
  options: ValuationReportOptions = {}
): Promise<ValuationReportResult> {
  console.log('Building valuation report with params:', params);
  
  // Generate a unique filename for the PDF
  const filename = `valuation-${params.make || 'unknown'}-${params.model || 'vehicle'}-${uuidv4().substring(0, 8)}.pdf`;
  
  // Determine the identifier type
  const identifierType: IdentifierType = params.identifierType || 'manual';
  
  // In the report generation function, make sure to handle the 'photo' type
  if (params.identifierType === 'photo') {
    // Add specific logic for photo-based valuation reports
    console.log('Building photo-based valuation report');
  }
  
  // Get vehicle image URL
  const vehicleImageUrl = await getVehicleImageUrl(
    params.make || '',
    params.model || '',
    params.year?.toString() || '',
    params.trim
  );
  
  // Format the valuation data for the PDF
  const pdfData = {
    vehicleInfo: {
      make: params.make || 'Unknown',
      model: params.model || 'Unknown',
      year: params.year || new Date().getFullYear(),
      mileage: params.mileage || 0,
      condition: params.condition || 'good',
      trim: params.trim || '',
      bodyType: params.bodyType || '',
      fuelType: params.fuelType || '',
      transmission: params.transmission || '',
      exteriorColor: params.exteriorColor || '',
      zipCode: params.zipCode || '',
    },
    valuationInfo: {
      estimatedValue: formatCurrency(valuationResult.estimatedValue),
      confidenceScore: `${valuationResult.confidenceScore}%`,
      priceRange: `${formatCurrency(valuationResult.priceRange[0])} - ${formatCurrency(valuationResult.priceRange[1])}`,
      baseValue: formatCurrency(valuationResult.baseValue || 0),
      adjustments: valuationResult.adjustments?.map(adj => ({
        factor: adj.factor,
        impact: formatCurrency(adj.impact),
        description: adj.description,
      })) || [],
    },
    imageUrl: vehicleImageUrl,
    reportDate: new Date().toLocaleDateString(),
    isPremium: params.isPremium || false,
  };
  
  // Generate the PDF
  const pdfBuffer = await generatePdf(pdfData, {
    includeMarketAnalysis: options.includeMarketAnalysis || false,
    includeSimilarListings: options.includeSimilarListings || false,
    includeHistoricalData: options.includeHistoricalData || false,
    includeConditionDetails: options.includeConditionDetails || false,
    includeFeatureBreakdown: options.includeFeatureBreakdown || false,
    includePriceAdjustments: options.includePriceAdjustments || true,
    includePhotos: options.includePhotos || false,
    includeCarfaxSummary: options.includeCarfaxSummary || false,
    customHeader: options.customHeader,
    customFooter: options.customFooter,
    logoUrl: options.logoUrl,
    watermark: options.watermark,
    colorScheme: options.colorScheme || 'light',
  });
  
  // Upload the PDF to S3
  const pdfUrl = await uploadToS3(pdfBuffer, filename, 'application/pdf');
  
  // Return expanded result with all required properties
  return {
    pdfUrl,
    pdfBuffer,
    make: params.make || 'Unknown',
    model: params.model || 'Unknown',
    year: params.year || new Date().getFullYear(),
    estimatedValue: valuationResult.estimatedValue,
    confidenceScore: valuationResult.confidenceScore,
    priceRange: valuationResult.priceRange,
    photoScore: valuationResult.photoScore,
    bestPhotoUrl: valuationResult.bestPhotoUrl || vehicleImageUrl,
    aiCondition: valuationResult.condition,
    explanation: valuationResult.explanation,
    isPremium: params.isPremium || false,
    adjustments: valuationResult.adjustments || [],
    features: params.features || [],
    trim: params.trim,
    vin: params.vin,
    color: params.exteriorColor,
    zip: params.zipCode
  };
}

export async function generateValuationReport(
  params: ExtendedValuationParams,
  options: ValuationReportOptions = {}
): Promise<ValuationReportResult> {
  // Calculate the valuation
  const valuationResult = await calculateValuation(params);
  
  // Build the report
  const result = await buildValuationReport(params, valuationResult, options);
  
  return result;
}
