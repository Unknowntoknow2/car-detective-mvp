
import React from 'react';

interface MarketComparisonProps {
  localAverage: number;
  nationalAverage: number;
  currentValue: number;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({ 
  localAverage, 
  nationalAverage, 
  currentValue 
}) => {
  const localDiff = ((currentValue - localAverage) / localAverage) * 100;
  const nationalDiff = ((currentValue - nationalAverage) / nationalAverage) * 100;
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Market Comparison</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between">
            <span>Local Average</span>
            <span className="font-semibold">${localAverage.toLocaleString()}</span>
          </div>
          <div className="text-sm text-right">
            <span className={localDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
              {localDiff >= 0 ? '+' : ''}{localDiff.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between">
            <span>National Average</span>
            <span className="font-semibold">${nationalAverage.toLocaleString()}</span>
          </div>
          <div className="text-sm text-right">
            <span className={nationalDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
              {nationalDiff >= 0 ? '+' : ''}{nationalDiff.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketComparison;
