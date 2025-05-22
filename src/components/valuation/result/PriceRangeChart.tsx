
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

export interface PriceRangeChartProps {
  priceRange: { low: number; high: number } | [number, number];
  estimatedValue?: number;
}

export const PriceRangeChart: React.FC<PriceRangeChartProps> = ({ 
  priceRange, 
  estimatedValue 
}) => {
  // Normalize price range format
  const lowPrice = Array.isArray(priceRange) ? priceRange[0] : priceRange.low;
  const highPrice = Array.isArray(priceRange) ? priceRange[1] : priceRange.high;
  
  // Calculate range width and position of estimated value
  const rangeWidth = highPrice - lowPrice;
  const valuePosition = estimatedValue ? 
    Math.min(Math.max(((estimatedValue - lowPrice) / rangeWidth) * 100, 0), 100) : 50;

  return (
    <div className="space-y-4">
      <div className="relative h-8 w-full rounded-md bg-gray-100">
        {/* Low Price Marker */}
        <div className="absolute -bottom-6 left-0 text-center">
          <div className="h-4 w-0.5 bg-gray-400 mx-auto"></div>
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {formatCurrency(lowPrice)}
          </span>
        </div>
        
        {/* High Price Marker */}
        <div className="absolute -bottom-6 right-0 text-center">
          <div className="h-4 w-0.5 bg-gray-400 mx-auto"></div>
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {formatCurrency(highPrice)}
          </span>
        </div>
        
        {/* Price Range Bar */}
        <div className="absolute top-0 left-0 h-full w-full rounded-md bg-gradient-to-r from-green-100 via-green-200 to-green-100"></div>
        
        {/* Estimated Value Marker */}
        {estimatedValue && (
          <div 
            className="absolute top-0 h-full w-2 bg-primary"
            style={{ left: `calc(${valuePosition}% - 4px)` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-white">
              {formatCurrency(estimatedValue)}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          This price range represents what similar vehicles are selling for in your area. 
          Your specific vehicle's value may vary based on its condition, options, and local market demand.
        </p>
      </div>
    </div>
  );
};
