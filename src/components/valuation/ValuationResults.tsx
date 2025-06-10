
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationResultProps {
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  confidenceScore: number;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({
  make,
  model,
  year,
  estimatedValue,
  confidenceScore
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Vehicle:</strong> {year} {make} {model}</p>
          <p><strong>Estimated Value:</strong> ${estimatedValue.toLocaleString()}</p>
          <p><strong>Confidence:</strong> {confidenceScore}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Export as both named and default for compatibility
export default ValuationResult;
export { ValuationResult as ValuationResults };
