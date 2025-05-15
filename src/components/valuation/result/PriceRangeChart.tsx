
import React from 'react';

interface PriceRangeChartProps {
  priceRange: [number, number];
  currentValue: number;
}

export const PriceRangeChart: React.FC<PriceRangeChartProps> = ({ priceRange, currentValue }) => {
  const [min, max] = priceRange;
  const range = max - min;
  const position = Math.min(Math.max((currentValue - min) / range, 0), 1) * 100;
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Price Range</h3>
      <div className="relative h-6 bg-gray-200 rounded-full">
        <div 
          className="absolute top-0 h-6 bg-blue-500 rounded-l-full"
          style={{ width: `${position}%` }}
        ></div>
        <div 
          className="absolute top-0 w-4 h-6 bg-red-500 rounded-full transform -translate-x-1/2"
          style={{ left: `${position}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceRangeChart;
