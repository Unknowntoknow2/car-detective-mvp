
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

export interface ValuationSummaryProps {
  confidenceScore: number;
  estimatedValue: number;
  vehicleInfo?: any; // Add vehicleInfo prop
  onEmailReport?: () => void;
}

const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  confidenceScore,
  estimatedValue,
  vehicleInfo,
  onEmailReport
}) => {
  const formatVehicleInfo = () => {
    if (!vehicleInfo) return 'Vehicle';
    
    const { year, make, model, trim } = vehicleInfo;
    let result = '';
    
    if (year) result += year + ' ';
    if (make) result += make + ' ';
    if (model) result += model;
    if (trim) result += ' ' + trim;
    
    return result.trim() || 'Vehicle';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Valuation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">{formatVehicleInfo()}</h3>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            Confidence Score: {confidenceScore}%
          </div>
        </div>
        
        {onEmailReport && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onEmailReport}
          >
            Email Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ValuationSummary;
