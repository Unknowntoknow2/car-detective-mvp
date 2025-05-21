
import React from 'react';

interface CompletionValuationHeaderProps {
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export const CompletionValuationHeader: React.FC<CompletionValuationHeaderProps> = ({
  make, 
  model, 
  year,
  estimatedValue,
  vehicleInfo,
  isPremium,
  additionalInfo
}) => {
  // If vehicleInfo is provided, use that instead of individual props
  const displayMake = vehicleInfo?.make || make;
  const displayModel = vehicleInfo?.model || model;
  const displayYear = vehicleInfo?.year || year;
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        {displayYear} {displayMake} {displayModel} Valuation
        {isPremium && (
          <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
            Premium
          </span>
        )}
      </h1>
      {estimatedValue && (
        <div className="mt-2 text-xl font-semibold text-green-600">
          Estimated Value: ${estimatedValue.toLocaleString()}
        </div>
      )}
      
      {vehicleInfo && (
        <div className="mt-2 flex flex-wrap gap-2">
          {vehicleInfo.mileage && (
            <span className="text-sm bg-slate-100 px-2 py-1 rounded">
              {vehicleInfo.mileage.toLocaleString()} miles
            </span>
          )}
          {vehicleInfo.condition && (
            <span className="text-sm bg-slate-100 px-2 py-1 rounded">
              {vehicleInfo.condition} condition
            </span>
          )}
          {additionalInfo && Object.entries(additionalInfo).map(([key, value]) => (
            <span key={key} className="text-sm bg-slate-100 px-2 py-1 rounded">
              {key}: {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
