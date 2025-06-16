
import React from 'react';

interface ValuationResultDisplayProps {
  data?: any;
  vehicleInfo?: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    condition: string;
  };
  estimatedValue?: number;
  confidenceScore?: number;
  onEmailReport?: () => void;
}

export const ValuationResultDisplay: React.FC<ValuationResultDisplayProps> = ({ 
  data, 
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  onEmailReport 
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Valuation Result</h3>
      
      {vehicleInfo && (
        <div className="mb-4">
          <h4 className="font-medium text-base">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            {vehicleInfo.trim && ` ${vehicleInfo.trim}`}
          </h4>
          <p className="text-sm text-gray-600">
            {vehicleInfo.mileage?.toLocaleString()} miles • {vehicleInfo.condition} condition
          </p>
        </div>
      )}

      {estimatedValue && (
        <div className="mb-4">
          <p className="text-2xl font-bold text-green-600">
            ${estimatedValue.toLocaleString()}
          </p>
          {confidenceScore && (
            <p className="text-sm text-gray-600">
              Confidence: {confidenceScore}%
            </p>
          )}
        </div>
      )}

      {onEmailReport && (
        <button 
          onClick={onEmailReport}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Email Report
        </button>
      )}
      
      {data && (
        <div className="mt-4">
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ValuationResultDisplay;
