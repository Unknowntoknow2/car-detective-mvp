
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceScore } from '@/components/valuation/ConfidenceScore';

interface SummaryProps {
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  currency?: string;
}

export const Summary: React.FC<SummaryProps> = ({
  estimatedValue,
  confidenceScore = 85,
  priceRange,
  currency = 'USD'
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  });
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="bg-primary p-6 text-white flex flex-col justify-center">
            <div>
              <h3 className="text-lg font-medium text-primary-foreground/80">
                Estimated Value
              </h3>
              <p className="text-3xl font-bold mt-1">
                {formatter.format(estimatedValue)}
              </p>
              
              {priceRange && (
                <p className="text-sm mt-2 text-primary-foreground/70">
                  Price Range: {formatter.format(priceRange[0])} - {formatter.format(priceRange[1])}
                </p>
              )}
            </div>
          </div>
          
          <div className="col-span-2 p-6">
            <div className="flex flex-col h-full justify-center">
              <h3 className="text-lg font-medium mb-4">Valuation Detail</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ConfidenceScore 
                  score={confidenceScore} 
                  comparableVehicles={125} 
                />
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Valuation Date
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
