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
    mileage: options.mileage || (vehicle.mileage ? Number(vehicle.mileage) : 0),
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
    bestPhotoUrl: options.bestPhotoUrl,
    photoExplanation: options.photoExplanation
  };

  // Add price range
  if (options.estimatedValue) {
    reportData.priceRange = [
      Math.round(options.estimatedValue * 0.95),
      Math.round(options.estimatedValue * 1.05)
    ];
  }

  // Add adjustments if provided
  if (options.adjustments && options.adjustments.length > 0) {
    reportData.adjustments = options.adjustments?.map(adj => ({
      name: adj.factor,
      value: adj.impact,
      description: adj.description || '',
      percentAdjustment: (adj.impact / options.estimatedValue) * 100
    })) || [];
  }

  // Handle aiCondition correctly
  if (options.aiCondition) {
    // Make sure condition is one of the allowed values
    let condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    
    if (options.aiCondition.condition === 'Excellent' || 
        options.aiCondition.condition === 'Good' || 
        options.aiCondition.condition === 'Fair' || 
        options.aiCondition.condition === 'Poor') {
      condition = options.aiCondition.condition;
    } else {
      // Default to Good if not one of the expected values
      condition = 'Good';
    }
    
    reportData.aiCondition = {
      condition,
      confidenceScore: options.aiCondition.confidenceScore || 80,
      issuesDetected: options.aiCondition.issuesDetected || [],
      aiSummary: options.aiCondition.aiSummary || ''
    };
  } else {
    reportData.aiCondition = null;
  }

  return reportData;
}
