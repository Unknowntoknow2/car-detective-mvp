/**
 * Premium Valuation Chart Component
 * Enterprise-grade visualization with interactive features
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ValuationResult } from '@/valuation/types/core';
import { formatCurrency } from '@/utils/formatCurrency';

interface PremiumValuationChartProps {
  valuation: ValuationResult;
}

export function PremiumValuationChart({ valuation }: PremiumValuationChartProps) {
  const baseValue = valuation.baseValuation.value;
  const finalValue = valuation.estimatedValue;
  const totalAdjustment = finalValue - baseValue;
  const adjustmentPercentage = ((totalAdjustment / baseValue) * 100);

  // Calculate adjustment breakdown for visualization
  const positiveAdjustments = valuation.adjustments.filter(adj => adj.impact > 0);
  const negativeAdjustments = valuation.adjustments.filter(adj => adj.impact < 0);
  
  const totalPositive = positiveAdjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const totalNegative = Math.abs(negativeAdjustments.reduce((sum, adj) => sum + adj.impact, 0));

  // Create visualization segments
  const chartSegments = [
    {
      label: 'Base Value',
      value: baseValue,
      percentage: 100,
      color: 'bg-blue-500',
      description: `From ${valuation.baseValuation.source.replace('_', ' ')}`
    }
  ];

  // Add positive adjustments
  positiveAdjustments.forEach(adj => {
    chartSegments.push({
      label: adj.factor,
      value: adj.impact,
      percentage: (adj.impact / baseValue) * 100,
      color: 'bg-green-500',
      description: adj.description
    });
  });

  // Add negative adjustments
  negativeAdjustments.forEach(adj => {
    chartSegments.push({
      label: adj.factor,
      value: adj.impact,
      percentage: (Math.abs(adj.impact) / baseValue) * 100,
      color: 'bg-red-500',
      description: adj.description
    });
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Valuation Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Value Flow Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Base Valuation</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(baseValue)}
            </span>
          </div>
          
          {/* Base value bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-80" />
            </div>
          </div>

          {/* Adjustments */}
          {valuation.adjustments.map((adjustment, index) => {
            const isPositive = adjustment.impact > 0;
            const percentage = Math.abs((adjustment.impact / baseValue) * 100);
            const maxPercentage = Math.min(percentage, 20); // Cap at 20% for visualization
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {adjustment.factor}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={isPositive ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {isPositive ? '+' : ''}{formatCurrency(adjustment.impact)}
                    </Badge>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${maxPercentage}%` }}
                  />
                </div>
                
                <p className="text-xs text-gray-600 pl-6">
                  {adjustment.description}
                </p>
              </div>
            );
          })}

          {/* Final value */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Final Estimated Value</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(finalValue)}
              </span>
            </div>
            
            {totalAdjustment !== 0 && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600">Net Adjustment</span>
                <span className={`text-sm font-medium ${totalAdjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalAdjustment > 0 ? '+' : ''}{formatCurrency(totalAdjustment)} 
                  ({adjustmentPercentage > 0 ? '+' : ''}{adjustmentPercentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Increases</div>
            <div className="text-lg font-semibold text-green-600">
              {totalPositive > 0 ? `+${formatCurrency(totalPositive)}` : formatCurrency(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Decreases</div>
            <div className="text-lg font-semibold text-red-600">
              {totalNegative > 0 ? `-${formatCurrency(totalNegative)}` : formatCurrency(0)}
            </div>
          </div>
        </div>

        {/* Confidence Indicator for Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
            <span className="text-sm font-semibold text-gray-900">
              {valuation.confidenceScore}%
            </span>
          </div>
          <Progress value={valuation.confidenceScore} className="h-2" />
          <p className="text-xs text-gray-600 mt-2">
            Based on {valuation.baseValuation.dataPointsUsed || 'multiple'} data points 
            from {valuation.metadata.dataSourcesUsed.length} sources
          </p>
        </div>
      </CardContent>
    </Card>
  );
}