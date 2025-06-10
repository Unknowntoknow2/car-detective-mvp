
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EnhancedValuationResultProps {
  valuationId: string;
  vehicleInfo: any;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: any[];
}

export const EnhancedValuationResult: React.FC<EnhancedValuationResultProps> = ({
  estimatedValue,
  confidenceScore,
  vehicleInfo
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Valuation Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Estimated Value</h3>
            <p className="text-2xl font-bold text-primary">
              ${estimatedValue.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Confidence Score</h3>
            <p className="text-lg">{confidenceScore}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedValuationResult;
