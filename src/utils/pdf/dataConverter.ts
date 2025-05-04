
import { PlateLookupInfo } from '@/types/lookup';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { ReportData, ValuationReportOptions } from './types';

export function convertVehicleInfoToReportData(
  vehicle: Partial<DecodedVehicleInfo | PlateLookupInfo>, 
  valuationData?: ValuationReportOptions
): ReportData {
  const defaultData = {
    mileage: "Unknown",
    estimatedValue: 0,
    confidenceScore: 0,
    condition: "Not Specified",
    fuelType: "Not Specified",
    zipCode: "Not Available",
    adjustments: []
  };

  const mergedData = { ...defaultData, ...valuationData };

  const baseReportData: ReportData = {
    vin: 'Unknown',
    make: vehicle.make || 'Unknown',
    model: vehicle.model || 'Unknown',
    year: vehicle.year || 'Unknown',
    mileage: mergedData.mileage?.toString() || "Unknown",
    estimatedValue: typeof mergedData.estimatedValue === 'number' ? mergedData.estimatedValue : 0,
    condition: mergedData.condition,
    fuelType: mergedData.fuelType,
    zipCode: mergedData.zipCode,
    confidenceScore: mergedData.confidenceScore,
    adjustments: mergedData.adjustments || [],
    carfaxData: mergedData.carfaxData,
    isPremium: mergedData.isPremium
  };

  if ('vin' in vehicle && vehicle.vin) {
    baseReportData.vin = vehicle.vin;
  }

  if ('plate' in vehicle && vehicle.plate) {
    baseReportData.plate = vehicle.plate;
  }

  if ('state' in vehicle && vehicle.state) {
    baseReportData.state = vehicle.state;
  }

  if ('color' in vehicle && vehicle.color) {
    baseReportData.color = vehicle.color;
  }

  if ('transmission' in vehicle && vehicle.transmission) {
    baseReportData.transmission = vehicle.transmission;
  }

  if ('bodyType' in vehicle && vehicle.bodyType) {
    baseReportData.bodyStyle = vehicle.bodyType; // Set bodyStyle
    baseReportData.bodyType = vehicle.bodyType; // Keep bodyType for backward compatibility
  }

  return baseReportData;
}
