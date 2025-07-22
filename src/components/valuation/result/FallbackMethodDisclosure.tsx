import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FallbackMethodDisclosureProps {
  isFallbackMethod: boolean;
  confidenceScore: number;
  marketListingsCount: number;
  estimatedValue: number;
  className?: string;
}

export const FallbackMethodDisclosure: React.FC<FallbackMethodDisclosureProps> = ({
  isFallbackMethod,
  confidenceScore,
  marketListingsCount,
  estimatedValue,
  className
}) => {
  // Only show the warning if we're using fallback method
  if (!isFallbackMethod || marketListingsCount > 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "relative w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800",
        "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
        className
      )}
      role="alert"
    >
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <div>
        <h5 className="mb-1 font-medium leading-none tracking-tight text-amber-800">
          Synthetic Valuation Method Used
        </h5>
        <div className="text-sm text-amber-700">
          <p className="mb-2">
            ⚠️ <strong>Due to a lack of active market listings for this vehicle</strong>, this valuation uses synthetic pricing 
            based on general industry data, manufacturer suggested retail pricing (MSRP), and standard depreciation curves.
          </p>
          <p className="mb-2">
            <strong>Confidence Impact:</strong> Maximum confidence capped at {confidenceScore}% (vs. up to 95% for 
            market-data backed valuations). This affects the accuracy and reliability of the estimated value.
          </p>
          <p>
            For high-value transactions (${(estimatedValue/1000).toFixed(0)}k+), we strongly recommend:
          </p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>Getting multiple valuation opinions</li>
            <li>Consulting with a professional appraiser</li>
            <li>Checking physical dealerships in your area</li>
          </ul>
        </div>
      </div>
    </div>
  );
};