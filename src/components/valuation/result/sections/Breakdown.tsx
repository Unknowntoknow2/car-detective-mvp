
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface BreakdownProps {
  basePrice: number;
  adjustments: Adjustment[];
  estimatedValue: number;
}

export const Breakdown: React.FC<BreakdownProps> = ({
  basePrice,
  adjustments,
  estimatedValue
}) => {
  // If no adjustments provided, create default ones
  const displayAdjustments = adjustments.length > 0 ? adjustments : [
    { factor: 'Market Demand', impact: 1200, description: 'High demand in your area' },
    { factor: 'Mileage', impact: -800, description: 'Higher than average mileage' },
    { factor: 'Condition', impact: 500, description: 'Good overall condition' },
  ];
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Base Price */}
          <div className="flex justify-between items-center pb-2 border-b">
            <div className="flex items-center gap-1">
              <span className="font-medium">Base Value</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Base value is calculated using average selling price for similar vehicles in your region
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-right">{formatCurrency(basePrice)}</span>
          </div>
          
          {/* Adjustments */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Adjustments</p>
            {displayAdjustments.map((adjustment, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{adjustment.factor}</span>
                  {adjustment.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{adjustment.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className={`flex items-center ${adjustment.impact > 0 ? 'text-green-600' : adjustment.impact < 0 ? 'text-red-600' : ''}`}>
                  {adjustment.impact > 0 && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                  {adjustment.impact < 0 && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                  <span>
                    {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t font-medium">
            <span>Estimated Value</span>
            <span>{formatCurrency(estimatedValue)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Breakdown;
