
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceScore } from '../ConfidenceScore';

interface ValuationSummaryProps {
  confidenceScore: number;
  estimatedValue: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
  };
}

export function ValuationSummary({ 
  confidenceScore, 
  estimatedValue, 
  vehicleInfo 
}: ValuationSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} 
            {vehicleInfo.trim && ` ${vehicleInfo.trim}`}
          </h2>
          <p className="text-3xl font-bold mt-2 text-primary">
            ${estimatedValue.toLocaleString()}
          </p>
        </div>
        
        <ConfidenceScore score={confidenceScore} />
      </CardContent>
    </Card>
  );
}
