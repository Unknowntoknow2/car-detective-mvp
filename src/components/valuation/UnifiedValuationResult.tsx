
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters/formatNumber';

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
}

export interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

export interface UnifiedValuationResultProps {
  valuationId: string;
  vehicleInfo: VehicleInfo;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Adjustment[];
  displayMode?: 'simple' | 'full';
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
}

const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  valuationId,
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments = [],
  displayMode = 'simple',
  onDownloadPdf,
  onEmailReport
}) => {
  // Generate price range if not provided
  const valuationRange = priceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];
  
  // Format values for display
  const formattedValue = formatNumber(estimatedValue, 0);
  const formattedMileage = formatNumber(vehicleInfo.mileage, 0);
  const formattedLowRange = formatNumber(valuationRange[0], 0);
  const formattedHighRange = formatNumber(valuationRange[1], 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </h2>
            <p className="text-gray-600">
              {formattedMileage} miles • {vehicleInfo.condition} condition
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Estimated Value</p>
            <p className="text-3xl font-bold text-primary">${formattedValue}</p>
            <p className="text-sm text-gray-600">
              Range: ${formattedLowRange} - ${formattedHighRange}
            </p>
          </div>
        </div>

        {displayMode === 'full' && adjustments.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Valuation Factors</h3>
            <div className="bg-gray-50 rounded-md p-4">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium">{adjustment.factor}</p>
                    <p className="text-sm text-gray-600">{adjustment.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={adjustment.impact >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {adjustment.impact >= 0 ? '+' : ''}{formatNumber(adjustment.impact, 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {displayMode === 'full' && (onDownloadPdf || onEmailReport) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {onDownloadPdf && (
              <button 
                onClick={onDownloadPdf}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Download PDF Report
              </button>
            )}
            {onEmailReport && (
              <button 
                onClick={onEmailReport}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Email Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedValuationResult;
