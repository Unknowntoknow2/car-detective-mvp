
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface BreakdownProps {
  adjustments: Adjustment[];
  baseValue?: number;
}

export const Breakdown: React.FC<BreakdownProps> = ({
  adjustments = [],
  baseValue
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  
  const formatAdjustment = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };
  
  const sortedAdjustments = [...adjustments].sort((a, b) => b.impact - a.impact);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Factors</CardTitle>
      </CardHeader>
      <CardContent>
        {baseValue && (
          <div className="mb-4 pb-4 border-b">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Base Market Value</span>
              <span className="font-semibold">{formatter.format(baseValue)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average market value before adjustments
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {sortedAdjustments.map((adjustment, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{adjustment.factor}</span>
                <span 
                  className={
                    adjustment.impact > 0 
                      ? 'text-green-600 font-semibold' 
                      : adjustment.impact < 0 
                        ? 'text-red-600 font-semibold' 
                        : 'font-semibold'
                  }
                >
                  {formatAdjustment(adjustment.impact)}
                </span>
              </div>
              
              {adjustment.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {adjustment.description}
                </p>
              )}
              
              <Progress 
                value={50 + adjustment.impact * 2.5} 
                className={`h-2 ${
                  adjustment.impact > 0 
                    ? 'bg-green-100' 
                    : adjustment.impact < 0 
                      ? 'bg-red-100' 
                      : ''
                }`}
              />
            </div>
          ))}
          
          {adjustments.length === 0 && (
            <p className="text-muted-foreground text-sm py-4">
              No specific adjustments applied to this valuation.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Breakdown;
