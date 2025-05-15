import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface AdjustmentBreakdownProps {
  basePrice: number;
  adjustments: Adjustment[];
  finalPrice: number;
  className?: string;
}

const AdjustmentBreakdown: React.FC<AdjustmentBreakdownProps> = ({
  basePrice,
  adjustments,
  finalPrice,
  className
}) => {
  // Sort adjustments by impact (largest to smallest)
  const sortedAdjustments = [...adjustments].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Price Adjustment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Base Price */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Base Value</span>
            <span className="font-semibold">${basePrice.toLocaleString()}</span>
          </div>
          
          <Separator />
          
          {/* Adjustments */}
          <div className="space-y-2">
            {sortedAdjustments.map((adjustment, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  {adjustment.impact > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-2" />
                  ) : adjustment.impact < 0 ? (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500 mr-2" />
                  )}
                  <span>{adjustment.factor}</span>
                </div>
                <span className={adjustment.impact > 0 ? 'text-green-600' : adjustment.impact < 0 ? 'text-red-600' : ''}>
                  {adjustment.impact > 0 ? '+' : ''}{adjustment.impact.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          {/* Final Price */}
          <div className="flex justify-between items-center font-bold">
            <span>Final Estimated Value</span>
            <span className="text-lg">${finalPrice.toLocaleString()}</span>
          </div>
          
          {/* Explanation */}
          {sortedAdjustments.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p>
                The base value is adjusted based on specific factors that affect your vehicle's market value.
                Positive adjustments increase value, while negative adjustments decrease it.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjustmentBreakdown;
