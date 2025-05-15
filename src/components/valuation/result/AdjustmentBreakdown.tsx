
import React from 'react';
import { AdjustmentBreakdown as AdjustmentType } from '@/types/valuation';

interface AdjustmentBreakdownProps {
  adjustments: AdjustmentType[];
  basePrice: number;
}

export const AdjustmentBreakdown: React.FC<AdjustmentBreakdownProps> = ({ adjustments, basePrice }) => {
  if (!adjustments || adjustments.length === 0) {
    return null;
  }
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Price Adjustments</h3>
      <div className="space-y-2">
        <div className="flex justify-between border-b pb-2">
          <span>Base Value</span>
          <span className="font-semibold">${basePrice.toLocaleString()}</span>
        </div>
        
        {adjustments.map((adjustment, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{adjustment.name}</span>
            <span className={adjustment.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {adjustment.value >= 0 ? '+' : ''}{adjustment.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdjustmentBreakdown;
