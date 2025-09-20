// Legacy data converter for backward compatibility
import type { UnifiedValuationResult } from '@/types/vehicleData';

interface LegacyValuationData {
  id?: string; // Add ID field for forecast integration
  estimated_value: number;
  confidence_score?: number;
  price_range_low?: number;
  price_range_high?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
    source?: string;
    timestamp?: string;
  }>;
  zip_code?: string;
  valuation_type?: string;
  data_sources?: string[];
  valuation_notes?: string[];
  vehicle_data?: any;
}

interface LegacyVehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  vin?: string;
  zipCode?: string;
}

export function convertLegacyToUnified(
  vehicleInfo: LegacyVehicleInfo,
  valuationData: LegacyValuationData
): UnifiedValuationResult {
  console.log('🔄 Converting legacy data:', { vehicleInfo, valuationData });
  return {
    id: valuationData.id || crypto.randomUUID(), // ✅ FIX #2: Ensure ID is included for forecast integration
    vin: vehicleInfo.vin || '',
    vehicle: {
      year: vehicleInfo.year,
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      trim: vehicleInfo.trim,
      fuelType: 'gasoline' // Default fallback
    },
    zip: vehicleInfo.zipCode || valuationData.zip_code || '',
    mileage: vehicleInfo.mileage || 0,
    baseValue: valuationData.estimated_value,
    adjustments: (valuationData.adjustments || []).map(adj => ({
      label: adj.factor,
      amount: adj.impact,
      reason: adj.description || 'No description available'
    })),
    finalValue: valuationData.estimated_value,
    confidenceScore: valuationData.confidence_score || 0,
    aiExplanation: valuationData.valuation_notes?.join(' ') || 'No explanation available',
    sources: valuationData.data_sources || ['legacy_system'],
    listingRange: valuationData.price_range_low && valuationData.price_range_high ? {
      min: valuationData.price_range_low,
      max: valuationData.price_range_high
    } : undefined,
    listingCount: 0,
    listings: [],
    marketSearchStatus: 'fallback' as const,
    timestamp: Date.now(),
    notes: valuationData.valuation_notes || []
  };
}