
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Send } from 'lucide-react';
import { toast } from 'sonner';

// Define interfaces for different data structures
interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: number;
  condition?: string;
}

interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

interface ValuationResultProps {
  // Common props
  valuationId?: string;
  
  // Detailed valuation props
  estimatedValue?: number;
  confidenceScore?: number;
  basePrice?: number;
  adjustments?: Adjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo?: VehicleInfo;
  
  // Raw data for simple view
  manualValuation?: any;
  photoCondition?: any;
  
  // Actions
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
  
  // View control
  displayMode?: 'simple' | 'detailed';
}

/**
 * UnifiedValuationResult - A component that displays valuation results
 * Can render in simple mode (just valuationId and raw data) or detailed mode (full breakdown)
 */
export const UnifiedValuationResult: React.FC<ValuationResultProps> = ({
  // Common props
  valuationId = '',
  
  // Detailed valuation props
  estimatedValue = 0,
  confidenceScore = 0,
  basePrice,
  adjustments = [],
  priceRange,
  demandFactor,
  vehicleInfo = {},
  
  // Raw data for simple view
  manualValuation,
  photoCondition,
  
  // Actions
  onDownloadPdf,
  onEmailReport,
  
  // View control
  displayMode = 'detailed'
}) => {
  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };
  
  const formatAdjustment = (impact: number) => {
    const prefix = impact > 0 ? '+' : '';
    return `${prefix}${formatCurrency(impact)}`;
  };

  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      toast.success("Download functionality coming soon!");
    }
  };

  const handleEmailReport = () => {
    if (onEmailReport) {
      onEmailReport();
    } else {
      toast.success("Email report functionality coming soon!");
    }
  };
  
  // Render simple view (just valuationId and raw data)
  if (displayMode === 'simple') {
    return (
      <Card className="bg-white border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle>Valuation Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Valuation ID</p>
            <p className="text-md font-medium">{valuationId}</p>
            {manualValuation && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Manual Valuation Data</p>
                <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(manualValuation, null, 2)}
                </pre>
              </div>
            )}
            {photoCondition && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Photo Condition Assessment</p>
                <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(photoCondition, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Detailed view with full breakdown
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle information card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-muted-foreground">Vehicle</h3>
              <p className="text-2xl font-bold">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.trim || ''}
              </p>
              {vehicleInfo.mileage && (
                <p className="text-muted-foreground">
                  {vehicleInfo.mileage.toLocaleString()} miles
                </p>
              )}
              {vehicleInfo.condition && (
                <p className="text-muted-foreground">
                  Condition: {vehicleInfo.condition}
                </p>
              )}
              {valuationId && (
                <p className="text-xs text-muted-foreground mt-2">
                  ID: {valuationId}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estimated value card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-muted-foreground">Estimated Value</h3>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(estimatedValue)}
              </p>
              {priceRange && (
                <p className="text-muted-foreground">
                  Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <div className="text-sm font-medium">
                  Confidence: {formatPercentage(confidenceScore)}
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${confidenceScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjustments breakdown card */}
      {adjustments && adjustments.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Valuation Breakdown</h3>
            {basePrice && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Base Value</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
            )}
            {adjustments.map((adj, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <span>{adj.description}</span>
                <span className={adj.impact > 0 ? 'text-green-600' : adj.impact < 0 ? 'text-red-600' : ''}>
                  {formatAdjustment(adj.impact)}
                </span>
              </div>
            ))}
            {demandFactor && (
              <div className="flex justify-between py-2 border-b">
                <span>Local Market Adjustment</span>
                <span>{demandFactor > 1 ? '+' : ''}{((demandFactor - 1) * 100).toFixed(1)}%</span>
              </div>
            )}
            <div className="flex justify-between py-2 mt-2 font-bold">
              <span>Final Value</span>
              <span>{formatCurrency(estimatedValue)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button 
          onClick={handleDownload}
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button 
          variant="outline" 
          onClick={handleEmailReport}
          className="flex-1"
        >
          <Send className="mr-2 h-4 w-4" />
          Email Report
        </Button>
      </div>
      
      {/* Raw data sections if available */}
      {manualValuation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manual Valuation Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(manualValuation, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
      
      {photoCondition && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Photo Condition Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(photoCondition, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Export both named and default export for flexibility
export default UnifiedValuationResult;
