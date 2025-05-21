
import React from 'react';

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
}

interface CompletionValuationHeaderProps {
  vehicleInfo: VehicleInfo;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export const CompletionValuationHeader: React.FC<CompletionValuationHeaderProps> = ({
  vehicleInfo,
  estimatedValue,
  isPremium = false,
  additionalInfo = {}
}) => {
  return (
    <div className="bg-primary/5 rounded-lg p-6 flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">
          {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
        </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-muted rounded-full text-xs">
            {vehicleInfo.mileage.toLocaleString()} miles
          </span>
          <span className="px-2 py-1 bg-muted rounded-full text-xs">
            Condition: {vehicleInfo.condition}
          </span>
          {Object.entries(additionalInfo).map(([key, value]) => (
            <span key={key} className="px-2 py-1 bg-muted rounded-full text-xs">
              {key}: {value}
            </span>
          ))}
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-sm text-muted-foreground">Estimated Value</div>
        <div className="text-3xl font-bold text-primary">
          ${estimatedValue.toLocaleString()}
        </div>
        {isPremium && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
            Premium Report
          </span>
        )}
      </div>
    </div>
  );
};
