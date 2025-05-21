
import React from 'react';

interface ValuationSummaryProps {
  valuation: any;
  showEstimatedValue?: boolean;
}

export function ValuationSummary({ valuation, showEstimatedValue = false }: ValuationSummaryProps) {
  if (!valuation) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No valuation data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Vehicle</p>
          <p className="font-medium">
            {valuation.year} {valuation.make} {valuation.model}
          </p>
        </div>
        
        {valuation.trim && (
          <div>
            <p className="text-sm text-muted-foreground">Trim</p>
            <p className="font-medium">{valuation.trim}</p>
          </div>
        )}
        
        {valuation.mileage && (
          <div>
            <p className="text-sm text-muted-foreground">Mileage</p>
            <p className="font-medium">{valuation.mileage.toLocaleString()} miles</p>
          </div>
        )}
        
        {valuation.condition && (
          <div>
            <p className="text-sm text-muted-foreground">Condition</p>
            <p className="font-medium capitalize">{valuation.condition}</p>
          </div>
        )}
      </div>
      
      {showEstimatedValue && valuation.estimatedValue && (
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <p className="text-sm text-muted-foreground">Estimated Value</p>
          <p className="text-xl font-bold text-primary">
            ${valuation.estimatedValue.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
