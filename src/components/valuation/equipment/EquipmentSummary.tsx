
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EquipmentSummaryProps {
  selectedEquipmentIds: number[];
  combinedMultiplier: number;
  totalValueAdd: number;
}

export function EquipmentSummary({ 
  selectedEquipmentIds, 
  combinedMultiplier, 
  totalValueAdd 
}: EquipmentSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Selected Options</p>
            <p className="text-lg font-medium">{selectedEquipmentIds.length} items</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Value Multiplier</p>
            <p className="text-lg font-medium">{combinedMultiplier.toFixed(2)}x</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Added Value</p>
            <p className="text-lg font-medium text-primary">+${totalValueAdd.toLocaleString()}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              These premium features and options are factored into your vehicle's valuation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
