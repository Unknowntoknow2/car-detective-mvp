
import { PlateLookupInfo } from '@/types/lookup';
import { DecodedVehicleInfo } from '@/types/vehicle';
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
    zipCode: "Not Available"
  };

  const mergedData = { ...defaultData, ...valuationData };

  const baseReportData: ReportData = {
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

  if ('vin' in vehicle) {
    baseReportData.vin = vehicle.vin;
  }

  if ('plate' in vehicle && 'state' in vehicle) {
    baseReportData.plate = vehicle.plate;
    baseReportData.state = vehicle.state;
  }

  if ('color' in vehicle) {
    baseReportData.color = vehicle.color || undefined;
  }

  if ('transmission' in vehicle) {
    baseReportData.transmission = vehicle.transmission || undefined;
  }

  return baseReportData;
}
