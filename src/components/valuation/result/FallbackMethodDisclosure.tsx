
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

interface FallbackMethodDisclosureProps {
  isFallbackMethod: boolean;
  confidenceScore: number;
  marketListingsCount: number;
  estimatedValue: number;
}

export const FallbackMethodDisclosure: React.FC<FallbackMethodDisclosureProps> = ({
  isFallbackMethod,
  confidenceScore,
  marketListingsCount,
  estimatedValue
}) => {
  if (!isFallbackMethod) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          This valuation is based on {marketListingsCount} real market listings and current transaction data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700">
        <div className="space-y-2">
          <p className="font-medium">Synthetic Valuation Method Active</p>
          <p className="text-sm">
            No current market listings were found for this vehicle. This ${estimatedValue.toLocaleString()} 
            estimate is generated using MSRP-based depreciation models and industry averages.
          </p>
          <p className="text-sm">
            <strong>Confidence: {confidenceScore}%</strong> (reduced due to lack of real market data)
          </p>
          <p className="text-xs mt-2 text-amber-600">
            💡 For transactions over $20,000, consider obtaining a professional appraisal or checking multiple valuation sources.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
