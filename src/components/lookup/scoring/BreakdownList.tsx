
import React from 'react';

interface BreakdownItem {
  factor: string;
  impact: number;
  description: string;
}

interface BreakdownListProps {
  items: BreakdownItem[];
  baseValue: number;
  comparableVehicles: number;
}

export const BreakdownList: React.FC<BreakdownListProps> = ({ 
  items, 
  baseValue, 
  comparableVehicles 
}) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-muted-foreground">Valuation Breakdown</h4>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.factor}</span>
            <span className={item.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
              {item.impact > 0 ? '+' : ''}{item.impact}%
            </span>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground pt-2 border-t">
        Based on {comparableVehicles} comparable vehicles
      </div>
    </div>
  );
};
