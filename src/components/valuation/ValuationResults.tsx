
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
}

interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

export interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: Adjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo: VehicleInfo;
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
}

export const ValuationResults: React.FC<ValuationResultsProps> = ({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments,
  priceRange,
  demandFactor,
  vehicleInfo,
  onDownloadPdf,
  onEmailReport,
}) => {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
};
