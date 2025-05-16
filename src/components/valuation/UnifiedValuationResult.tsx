
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface UnifiedValuationResultProps {
  valuationId: string;
  displayMode?: 'summary' | 'full';
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    mileage?: number;
    condition?: string;
  };
  onDownloadPdf?: () => Promise<void> | void; // Add this missing prop
  onEmailReport?: () => Promise<void> | void; // Add this missing prop
}

const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  valuationId,
  displayMode = 'summary',
  estimatedValue,
  confidenceScore = 85,
  priceRange,
  adjustments = [],
  vehicleInfo = {},
  onDownloadPdf, // Add this to destructuring
  onEmailReport // Add this to destructuring
}) => {
  // Calculate price range if not provided
  const calculatedPriceRange = priceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Estimated Value</span>
          <span className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Vehicle information */}
        {vehicleInfo && (
          <div className="mb-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold text-lg mb-2">
              {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {vehicleInfo.mileage && (
                <div>
                  <span className="text-muted-foreground">Mileage:</span> {vehicleInfo.mileage.toLocaleString()} mi
                </div>
              )}
              {vehicleInfo.condition && (
                <div>
                  <span className="text-muted-foreground">Condition:</span> {vehicleInfo.condition}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price range and confidence */}
        <div className="space-y-3 mb-6">
          <div>
            <span className="text-muted-foreground">Price Range:</span>{' '}
            <span className="font-medium">
              {formatCurrency(calculatedPriceRange[0])} - {formatCurrency(calculatedPriceRange[1])}
            </span>
          </div>
          {confidenceScore && (
            <div>
              <span className="text-muted-foreground">Confidence Score:</span>{' '}
              <span className="font-medium">{confidenceScore}%</span>
            </div>
          )}
        </div>

        {/* Adjustments (only in full mode) */}
        {displayMode === 'full' && adjustments && adjustments.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Value Adjustments</h3>
            <div className="space-y-2">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{adjustment.factor}</span>
                  <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {(onDownloadPdf || onEmailReport) && (
          <div className="flex gap-3 mt-6">
            {onDownloadPdf && (
              <Button variant="outline" onClick={onDownloadPdf} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
            {onEmailReport && (
              <Button variant="outline" onClick={onEmailReport} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedValuationResult;
