import { ValuationParams, ValuationResult } from '@/utils/valuation/types';
import { generatePDF } from '@/utils/pdf/pdfGenerator';
import { formatCurrency } from '@/utils/formatters';
import { getVehicleImageUrl } from '@/utils/vehicleImages';
import { uploadToS3 } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { calculateValuation } from '@/utils/valuation/calculator';

// Update the type to include 'photo'
type IdentifierType = 'vin' | 'plate' | 'manual' | 'photo';

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

export async function buildValuationReport(
  params: ValuationParams,
  valuationResult: ValuationResult,
  options: ValuationReportOptions = {}
): Promise<{ pdfUrl: string; pdfBuffer: Buffer }> {
  console.log('Building valuation report with params:', params);
  
  // Generate a unique filename for the PDF
  const filename = `valuation-${params.make}-${params.model}-${uuidv4().substring(0, 8)}.pdf`;
  
  // Determine the identifier type
  const identifierType: IdentifierType = params.identifierType as IdentifierType || 'manual';
  
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
      adjustments: valuationResult.adjustments.map(adj => ({
        factor: adj.factor,
        impact: formatCurrency(adj.impact),
        description: adj.description,
      })),
    },
    imageUrl: vehicleImageUrl,
    reportDate: new Date().toLocaleDateString(),
    isPremium: params.isPremium || false,
  };
  
  // Generate the PDF
  const pdfBuffer = await generatePDF(pdfData, {
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
  
  return {
    pdfUrl,
    pdfBuffer,
  };
}

export async function generateValuationReport(
  params: ValuationParams,
  options: ValuationReportOptions = {}
): Promise<{ pdfUrl: string; pdfBuffer: Buffer; valuationResult: ValuationResult }> {
  // Calculate the valuation
  const valuationResult = await calculateValuation(params);
  
  // Build the report
  const { pdfUrl, pdfBuffer } = await buildValuationReport(params, valuationResult, options);
  
  return {
    pdfUrl,
    pdfBuffer,
    valuationResult,
  };
}
