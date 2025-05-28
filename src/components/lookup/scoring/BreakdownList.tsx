
import React from 'react';
import { BreakdownItem, BreakdownItemProps } from './BreakdownItem';

interface BreakdownListProps {
  items: BreakdownItemProps[];
  baseValue: number;
  comparableVehicles: number;
}

export const BreakdownList = ({ items, baseValue, comparableVehicles }: BreakdownListProps) => (
  <div className="space-y-4">
    <div className="border-b pb-2">
      <h4 className="font-medium">Valuation Breakdown</h4>
      <p className="text-sm text-muted-foreground">
        Based on {comparableVehicles} similar vehicles in your area
      </p>
    </div>
    {items.map((item, idx) => (
      <BreakdownItem key={idx} {...item} />
    ))}
  </div>
);

