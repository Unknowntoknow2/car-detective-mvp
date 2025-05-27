
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Valuation } from '@/types/valuation-history';
import { Progress } from '@/components/ui/progress';

interface ValuationBreakdownProps {
  valuation: Valuation;
}

export function ValuationBreakdown({ valuation }: ValuationBreakdownProps) {
  const estimatedValue = valuation.estimatedValue || valuation.estimated_value || 0;
  
  // Define some common adjustment factors based on valuation data
  const adjustmentFactors = [
    {
      name: 'Base Value',
      percentage: 100,
      value: estimatedValue * 0.8,
      description: 'Starting point based on make, model, and year'
    },
    {
      name: 'Mileage',
      percentage: valuation.mileage && valuation.mileage > 50000 ? -10 : 5,
      value: estimatedValue * (valuation.mileage && valuation.mileage > 50000 ? -0.1 : 0.05),
      description: `${valuation.mileage?.toLocaleString() || 'Unknown'} miles`
    },
    {
      name: 'Condition',
      percentage: valuation.condition === 'Excellent' ? 15 : 
                 valuation.condition === 'Good' ? 5 : 
                 valuation.condition === 'Fair' ? -5 : -15,
      value: estimatedValue * (valuation.condition === 'Excellent' ? 0.15 : 
                              valuation.condition === 'Good' ? 0.05 : 
                              valuation.condition === 'Fair' ? -0.05 : -0.15),
      description: valuation.condition || 'Unknown'
    },
    {
      name: 'Market Demand',
      percentage: 7,
      value: estimatedValue * 0.07,
      description: 'Current market conditions'
    }
  ];

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {adjustmentFactors.map((factor, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{factor.name}</span>
                <span className={`font-medium ${factor.percentage > 0 ? 'text-green-600' : factor.percentage < 0 ? 'text-red-600' : ''}`}>
                  {factor.percentage > 0 ? '+' : ''}{factor.percentage}%
                </span>
              </div>
              <Progress 
                value={50 + factor.percentage} 
                className={`h-2 ${factor.percentage > 0 ? 'bg-green-200' : factor.percentage < 0 ? 'bg-red-200' : 'bg-gray-200'}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{factor.description}</span>
                <span>{formatCurrency(factor.value)}</span>
              </div>
            </div>
          ))}
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between font-medium">
              <span>Final Valuation</span>
              <span className="text-primary">
                {formatCurrency(estimatedValue)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
