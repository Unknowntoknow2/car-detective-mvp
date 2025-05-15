
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

interface ValuationResultProps {
  valuationId: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  displayMode?: string; // Added the missing property
  onDownloadPdf?: () => Promise<void>; // Added missing property
  onEmailReport?: () => Promise<void>; // Added missing property
}

const UnifiedValuationResult: React.FC<ValuationResultProps> = ({
  valuationId,
  vehicleInfo,
  estimatedValue,
  confidenceScore = 85,
  priceRange = [0, 0],
  adjustments = [],
  displayMode = 'default',
  onDownloadPdf,
  onEmailReport
}) => {
  // Format currency with thousands separator
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-4">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-slate-50 px-4 py-2 rounded-md">
            <span className="text-sm text-slate-500">Mileage</span>
            <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} miles</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-md">
            <span className="text-sm text-slate-500">Condition</span>
            <p className="font-medium capitalize">{vehicleInfo.condition}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 items-center">
            <div>
              <span className="text-sm text-slate-500">Estimated Value</span>
              <p className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
              
              <div className="mt-1">
                <span className="text-sm text-slate-500">Price Range: </span>
                <span className="text-sm font-medium">
                  {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-full">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-primary">{confidenceScore}%</span>
                  <span className="text-xs text-slate-500">Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add action buttons if handlers are provided */}
        {(onDownloadPdf || onEmailReport) && displayMode === 'full' && (
          <div className="mt-6 flex flex-wrap gap-3">
            {onDownloadPdf && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={onDownloadPdf}
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            )}
            
            {onEmailReport && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={onEmailReport}
              >
                <Mail className="h-4 w-4" />
                Email Report
              </Button>
            )}
          </div>
        )}
      </div>
      
      {adjustments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Adjustment Factors</h3>
            <div className="space-y-3">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{adjustment.factor}</p>
                    {adjustment.description && (
                      <p className="text-sm text-slate-500">{adjustment.description}</p>
                    )}
                  </div>
                  <span className={`font-medium ${adjustment.impact >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {adjustment.impact > 0 ? '+' : ''}{adjustment.impact}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center text-sm text-slate-500">
        Valuation ID: {valuationId}
      </div>
    </div>
  );
};

export default UnifiedValuationResult;
