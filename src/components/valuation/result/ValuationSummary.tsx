import React from 'react';
import { ConfidenceScore } from '@/components/lookup/scoring/ConfidenceScore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';
import { VehicleScoreInfo } from '@/components/lookup/scoring/VehicleScoreInfo';
import { BreakdownList } from '@/components/lookup/scoring/BreakdownList';
import { BreakdownItemProps } from '@/components/lookup/scoring/BreakdownItem';

interface ValuationSummaryProps {
  estimatedValue: number;
  confidenceScore: number;
  baseValue: number;
  adjustments: BreakdownItemProps[];
  comparableVehicles: number;
  isPremium?: boolean;
}

const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  estimatedValue,
  confidenceScore,
  baseValue,
  adjustments,
  comparableVehicles,
  isPremium = false
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Valuation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <VehicleScoreInfo
            label="Estimated Value"
            value={estimatedValue}
            tooltipContent={
              <p>Our estimated market value based on similar vehicles and current market conditions.</p>
            }
          />
          <VehicleScoreInfo
            label="Base Value"
            value={baseValue}
            tooltipContent={
              <p>The starting value before adjustments for condition, mileage, and features.</p>
            }
          />
          <ConfidenceScore 
            score={confidenceScore} 
            comparableVehicles={comparableVehicles} 
          />
        </div>
        
        <Separator className="my-6" />
        
        <BreakdownList 
          items={adjustments}
          baseValue={baseValue}
          comparableVehicles={comparableVehicles}
        />
        
        {!isPremium && (
          <div className="mt-6 p-4 bg-muted/30 rounded-md text-center text-sm">
            <p className="text-muted-foreground">
              Upgrade to Premium for detailed market analysis and historical price trends
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValuationSummary;
