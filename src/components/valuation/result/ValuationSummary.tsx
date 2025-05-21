import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { ValuationResult } from '@/types/valuation';

export interface ValuationSummaryProps {
  confidenceScore: number;
  estimatedValue: number;
  vehicleInfo?: any;
  onEmailReport?: () => void;
  valuation?: ValuationResult;
  showEstimatedValue?: boolean;
}

const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  confidenceScore,
  estimatedValue,
  vehicleInfo,
  onEmailReport,
  valuation,
  showEstimatedValue = false
}) => {
  // Use valuation data if provided, otherwise fall back to props
  const displayValue = showEstimatedValue && valuation?.estimatedValue 
    ? valuation.estimatedValue
    : estimatedValue;
  
  const displayConfidence = valuation?.confidenceScore || confidenceScore;
  
  const formatVehicleInfo = () => {
    // If we have valuation data, use it
    if (valuation) {
      const { year, make, model, trim } = valuation;
      let result = '';
      
      if (year) result += year + ' ';
      if (make) result += make + ' ';
      if (model) result += model;
      if (trim) result += ' ' + trim;
      
      return result.trim() || 'Vehicle';
    }
    
    // Otherwise use vehicleInfo
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
            {formatCurrency(displayValue)}
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            Confidence Score: {displayConfidence}%
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
