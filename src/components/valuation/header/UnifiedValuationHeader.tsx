
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface UnifiedValuationHeaderProps {
  year: number;
  make: string;
  model: string;
  valuation: number;
  confidenceScore?: number;
  condition?: string;
  location?: string;
  mileage?: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage?: number;
    vin?: string;
    estimatedValue?: number;
    condition?: string;
  };
  photoSubmitted?: boolean;
  photoCondition?: any;
  calculationInProgress?: boolean;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  onDownloadPdf?: () => void;
  onShareReport?: () => void;
  onShare?: () => void;
  onSaveToAccount?: () => void;
  isSaving?: boolean;
  onDownload?: () => void;
}

export function UnifiedValuationHeader({
  year,
  make,
  model,
  valuation,
  confidenceScore,
  condition,
  location,
  mileage,
  vehicleInfo,
  onDownloadPdf,
  onShareReport,
  onShare,
  onSaveToAccount,
  isSaving,
  onDownload
}: UnifiedValuationHeaderProps) {
  // Use vehicleInfo props if provided, otherwise use individual props
  const displayYear = vehicleInfo?.year || year;
  const displayMake = vehicleInfo?.make || make;
  const displayModel = vehicleInfo?.model || model;
  const displayValuation = vehicleInfo?.estimatedValue || valuation;
  const displayCondition = vehicleInfo?.condition || condition;
  const displayMileage = vehicleInfo?.mileage || mileage;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">{displayYear} {displayMake} {displayModel}</h1>
        
        <div className="flex space-x-2 mt-2 md:mt-0">
          {(onShareReport || onShare) && (
            <Button variant="outline" size="sm" onClick={onShareReport || onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          
          {(onDownloadPdf || onDownload) && (
            <Button variant="outline" size="sm" onClick={onDownloadPdf || onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
          
          {onSaveToAccount && (
            <Button variant="outline" size="sm" onClick={onSaveToAccount} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Estimated Value</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(displayValuation)}</p>
          {confidenceScore && (
            <p className="text-xs text-muted-foreground mt-1">
              {confidenceScore >= 80 ? 'High' : confidenceScore >= 60 ? 'Medium' : 'Low'} confidence
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {displayCondition && (
            <div>
              <p className="text-muted-foreground">Condition</p>
              <p className="font-medium capitalize">{displayCondition}</p>
            </div>
          )}
          
          {location && (
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{location}</p>
            </div>
          )}
          
          {displayMileage && (
            <div>
              <p className="text-muted-foreground">Mileage</p>
              <p className="font-medium">{displayMileage.toLocaleString()} miles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnifiedValuationHeader;
