
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export interface UnifiedValuationHeaderProps {
  displayMode?: 'simple' | 'detailed' | 'full';
  estimatedValue: number;
  valuation?: number; // Add this for backward compatibility
  confidenceScore?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  // Add support for vehicleInfo object
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
  // Support for older properties
  condition?: string;
  location?: string;
  mileage?: number;
  onDownload?: () => void;
  onDownloadPdf?: () => void;
  onShare?: () => void;
  onShareReport?: () => void;
  onSaveToAccount?: () => Promise<void>;
  isSaving?: boolean;
  photoSubmitted?: boolean;
  photoCondition?: any;
  calculationInProgress?: boolean;
  bestPhotoUrl?: string;
  isPremium?: boolean;
}

export function UnifiedValuationHeader({
  displayMode = 'simple',
  estimatedValue,
  valuation, // Support both property names
  confidenceScore,
  year,
  make,
  model,
  trim,
  vehicleInfo,
  condition,
  location,
  mileage,
  onDownload,
  onDownloadPdf, // Support both callback names
  onShare,
  onShareReport, // Support both callback names
  onSaveToAccount,
  isSaving,
  photoSubmitted,
  photoCondition,
  calculationInProgress,
  bestPhotoUrl,
  isPremium
}: UnifiedValuationHeaderProps) {
  // Extract vehicle info from the vehicleInfo object if provided
  const vehicleMake = vehicleInfo?.make || make || '';
  const vehicleModel = vehicleInfo?.model || model || '';
  const vehicleYear = vehicleInfo?.year || year || 0;
  const vehicleTrim = vehicleInfo?.trim || trim || '';
  const vehicleMileage = vehicleInfo?.mileage || mileage;
  const vehicleCondition = vehicleInfo?.condition || condition;
  
  // Use either estimatedValue or valuation
  const displayValue = valuation || estimatedValue;
  
  const getConfidenceLabel = (score: number) => {
    if (score >= 85) return 'Very High';
    if (score >= 70) return 'High';
    if (score >= 50) return 'Moderate';
    return 'Low';
  };

  // Handle both callback variants
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (onDownloadPdf) {
      onDownloadPdf();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (onShareReport) {
      onShareReport();
    }
  };

  return (
    <Card className="border-primary/10 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary/90">
              {vehicleYear} {vehicleMake} {vehicleModel}
              {vehicleTrim && ` ${vehicleTrim}`}
            </h2>
            
            {displayMode !== 'simple' && vehicleMileage && (
              <p className="text-muted-foreground">
                Mileage: {vehicleMileage.toLocaleString()} miles
              </p>
            )}
            
            {displayMode === 'full' && vehicleCondition && (
              <p className="text-muted-foreground capitalize">
                Condition: {vehicleCondition}
              </p>
            )}
            
            {displayMode === 'full' && vehicleInfo?.vin && (
              <p className="text-xs text-muted-foreground font-mono">
                VIN: {vehicleInfo.vin}
              </p>
            )}
            
            {displayMode === 'full' && location && (
              <p className="text-xs text-muted-foreground">
                Location: {location}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <h1 className="text-3xl font-bold text-primary">
                {formatCurrency(displayValue)}
              </h1>
              
              {confidenceScore !== undefined && (
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-muted-foreground">
                    Confidence: {getConfidenceLabel(confidenceScore)}
                  </span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        confidenceScore >= 85 ? 'bg-green-500' :
                        confidenceScore >= 70 ? 'bg-green-400' :
                        confidenceScore >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${confidenceScore}%` }}
                    />
                  </div>
                </div>
              )}
              
              {displayMode === 'full' && (onDownload || onDownloadPdf) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  className="mt-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Report
                </Button>
              )}
              
              {onSaveToAccount && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSaveToAccount}
                  disabled={isSaving}
                  className="mt-2"
                >
                  {isSaving ? 'Saving...' : 'Save to Account'}
                </Button>
              )}
              
              {(onShare || onShareReport) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="mt-2 ml-2"
                >
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UnifiedValuationHeader;
