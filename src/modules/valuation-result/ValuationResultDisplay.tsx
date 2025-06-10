
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

interface ValuationResultDisplayProps {
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    condition: string;
  };
  estimatedValue: number;
  confidenceScore: number;
  onEmailReport: () => void;
}

export const ValuationResultDisplay: React.FC<ValuationResultDisplayProps> = ({
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  onEmailReport,
}) => {
  const { year, make, model, trim, mileage, condition } = vehicleInfo;
  const vehicleName = [year, make, model, trim].filter(Boolean).join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{vehicleName}</h3>
          <p className="text-sm text-muted-foreground">
            {mileage.toLocaleString()} miles • {condition} condition
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(estimatedValue)}
            </p>
            <p className="text-sm text-green-700">Estimated Value</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{confidenceScore}%</p>
            <p className="text-sm text-blue-700">Confidence Score</p>
          </div>
        </div>
        
        <Button onClick={onEmailReport} className="w-full">
          Email Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValuationResultDisplay;
