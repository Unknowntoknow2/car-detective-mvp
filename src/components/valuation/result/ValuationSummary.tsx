
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export interface ValuationSummaryProps {
  estimatedValue: number;
  confidenceScore: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    mileage?: number;
    condition?: string;
  };
}

export const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  estimatedValue,
  confidenceScore,
  vehicleInfo
}) => {
  const confidenceLevel = confidenceScore >= 85 ? 'High' :
                          confidenceScore >= 70 ? 'Medium' : 'Low';
  
  const confidenceColor = confidenceScore >= 85 ? 'text-green-600' :
                          confidenceScore >= 70 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Estimated Value</h3>
          <p className="text-3xl font-bold">{formatCurrency(estimatedValue)}</p>
        </div>
        
        <div className="mt-2 sm:mt-0">
          <h3 className="text-sm font-medium text-muted-foreground">Confidence Score</h3>
          <div className="flex items-center gap-2">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div 
                className={cn("h-2 rounded-full", 
                  confidenceScore >= 85 ? "bg-green-500" : 
                  confidenceScore >= 70 ? "bg-amber-500" : 
                  "bg-red-500"
                )}
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <span className={cn("text-sm font-medium", confidenceColor)}>
              {confidenceScore}% ({confidenceLevel})
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-gray-50 p-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Year</p>
          <p className="font-medium">{vehicleInfo.year}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Make</p>
          <p className="font-medium">{vehicleInfo.make}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Model</p>
          <p className="font-medium">{vehicleInfo.model}</p>
        </div>
        {vehicleInfo.mileage && (
          <div>
            <p className="text-xs text-muted-foreground">Mileage</p>
            <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} mi</p>
          </div>
        )}
        {vehicleInfo.condition && (
          <div>
            <p className="text-xs text-muted-foreground">Condition</p>
            <p className="font-medium">{vehicleInfo.condition}</p>
          </div>
        )}
      </div>
    </div>
  );
};
