
import { DecodedVehicleInfo } from '@/types/vehicle';
import { AICondition } from '@/types/photo';
import { ReportData, ReportOptions } from './types';

/**
 * Converts vehicle information to PDF report data format
 */
export function convertVehicleInfoToReportData(
  vehicle: DecodedVehicleInfo,
  options: {
    mileage?: number;
    estimatedValue?: number;
    condition?: string;
    zipCode?: string;
    confidenceScore?: number;
    adjustments?: {
      factor: string;
      impact: number;
      description: string;
    }[];
    aiCondition?: AICondition | null;
    isPremium?: boolean;
    bestPhotoUrl?: string;
    photoExplanation?: string;
  } = {}
): ReportData {
  // Extract values with fallbacks
  const reportData: ReportData = {
    vin: vehicle.vin || 'Unknown',
    make: vehicle.make || '',
    model: vehicle.model || '',
    year: vehicle.year || 0,
    mileage: options.mileage?.toString() || vehicle.mileage?.toString() || '0',
    condition: (options.condition || vehicle.condition || 'Good') as 'Excellent' | 'Good' | 'Fair' | 'Poor',
    zipCode: options.zipCode || vehicle.zipCode || '',
    estimatedValue: options.estimatedValue || 0,
    confidenceScore: options.confidenceScore || 85,
    color: vehicle.color || 'Not Specified',
    bodyStyle: vehicle.bodyType || 'Not Specified',
    bodyType: vehicle.bodyType || 'Not Specified',
    fuelType: vehicle.fuelType || 'Not Specified',
    explanation: 'Generated using AI-powered market data analysis',
    isPremium: options.isPremium || false,
    transmission: vehicle.transmission || 'Not Specified',
    aiCondition: options.aiCondition ? {
      condition: options.aiCondition.condition || 'Good',
      confidenceScore: options.aiCondition.confidenceScore || 80,
      issuesDetected: options.aiCondition.issuesDetected || [],
      aiSummary: options.aiCondition.aiSummary || ''
    } : null,
    bestPhotoUrl: options.bestPhotoUrl,
    photoExplanation: options.photoExplanation,
    priceRange: [
      Math.round((options.estimatedValue || 0) * 0.95),
      Math.round((options.estimatedValue || 0) * 1.05)
    ]
  };

  // Add adjustments if provided
  if (options.adjustments && options.adjustments.length > 0) {
    reportData.adjustments = options.adjustments;
  }

  return reportData;
}
