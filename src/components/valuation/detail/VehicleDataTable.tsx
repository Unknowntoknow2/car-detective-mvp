
import React from 'react';
import { ManualVehicleInfo } from '@/hooks/useManualValuation';

interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
  trim?: string;
  bodyType?: string;
  transmission?: string;
  color?: string;
}

interface VehicleDataTableProps {
  vehicleInfo: VehicleInfo;
  manualValuation?: ManualVehicleInfo;
}

export function VehicleDataTable({ vehicleInfo, manualValuation }: VehicleDataTableProps) {
  // Merge the data from both sources, prioritizing vehicleInfo
  const mergedData = {
    ...manualValuation,
    ...vehicleInfo,
  };

  // Format values for display
  const formatValue = (key: string, value: any) => {
    if (value === undefined || value === null) return 'Not available';
    
    if (key === 'mileage' && typeof value === 'number') {
      return value.toLocaleString() + ' miles';
    }
    
    if (key === 'year' && typeof value === 'number') {
      return value.toString();
    }
    
    return value;
  };

  // Create an array of data rows to display
  const dataRows = [
    { label: 'Year', value: formatValue('year', mergedData.year) },
    { label: 'Make', value: formatValue('make', mergedData.make) },
    { label: 'Model', value: formatValue('model', mergedData.model) },
    { label: 'Trim', value: formatValue('trim', mergedData.trim) },
    { label: 'Mileage', value: formatValue('mileage', mergedData.mileage) },
    { label: 'Fuel Type', value: formatValue('fuelType', mergedData.fuelType) },
    { label: 'Condition', value: formatValue('condition', mergedData.condition) },
    { label: 'Location', value: formatValue('zipCode', mergedData.zipCode) },
    { label: 'Body Type', value: formatValue('bodyType', mergedData.bodyType) },
    { label: 'Transmission', value: formatValue('transmission', mergedData.transmission) },
    { label: 'Color', value: formatValue('color', mergedData.color) },
  ].filter(row => row.value !== 'Not available');

  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="w-full text-sm">
        <tbody className="divide-y">
          {dataRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-2 px-4 font-medium text-gray-700">{row.label}</td>
              <td className="py-2 px-4 text-gray-600">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
