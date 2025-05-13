
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface ValuationHeaderProps {
  // Allow either individual props or a vehicleInfo object
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    condition?: string;
    trim?: string;
  };
  // Individual props
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  // Value props
  estimatedValue: number;
  isPremium?: boolean;
  confidenceScore?: number;
  calculationInProgress?: boolean;
  additionalInfo?: Record<string, string>;
  // Action props
  onShare?: () => void;
  onSaveToAccount?: () => void;
  isSaving?: boolean;
  onDownload?: () => void;
}

export function ValuationHeader({
  vehicleInfo,
  make,
  model,
  year,
  mileage,
  condition,
  estimatedValue,
  isPremium = false,
  confidenceScore,
  calculationInProgress = false,
  additionalInfo = {},
  onShare,
  onSaveToAccount,
  isSaving = false,
  onDownload
}: ValuationHeaderProps) {
  // Get values either from vehicleInfo or individual props
  const vehicleMake = vehicleInfo?.make || make || 'Unknown';
  const vehicleModel = vehicleInfo?.model || model || 'Unknown';
  const vehicleYear = vehicleInfo?.year || year || new Date().getFullYear();
  const vehicleMileage = vehicleInfo?.mileage || mileage;
  const vehicleCondition = vehicleInfo?.condition || condition;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              {vehicleYear} {vehicleMake} {vehicleModel}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {vehicleMileage && (
                <Badge variant="outline" className="font-normal">
                  {vehicleMileage.toLocaleString()} miles
                </Badge>
              )}
              
              {vehicleCondition && (
                <Badge variant="outline" className="font-normal">
                  {vehicleCondition}
                </Badge>
              )}
              
              {Object.entries(additionalInfo).map(([key, value]) => (
                <Badge key={key} variant="outline" className="font-normal">
                  {value}
                </Badge>
              ))}
              
              {isPremium && (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  Premium
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
            {calculationInProgress ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">Calculating...</span>
              </div>
            ) : (
              <div className="text-3xl font-bold text-center">
                {formatCurrency(estimatedValue)}
              </div>
            )}
            {!calculationInProgress && confidenceScore && (
              <div className="text-xs text-muted-foreground mt-1">
                {confidenceScore}% confidence
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
