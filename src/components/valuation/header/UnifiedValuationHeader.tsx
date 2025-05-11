
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Share, Download, Star, Calendar, Car } from 'lucide-react';

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  vin?: string;
}

export interface UnifiedValuationHeaderProps {
  // Vehicle information
  vehicleInfo: VehicleInfo;
  
  // Valuation data
  estimatedValue?: number;
  confidenceScore?: number;
  
  // Photo information
  bestPhotoUrl?: string;
  photoScore?: number;
  photoCondition?: any;
  
  // Status flags
  calculationInProgress?: boolean;
  photoSubmitted?: boolean;
  isPremium?: boolean;
  
  // Actions
  onShare?: () => void;
  onDownload?: () => void;
  onSaveToAccount?: () => void;
  isSaving?: boolean;
  
  // Display mode
  displayMode?: 'simple' | 'detailed' | 'card';
  
  // Additional information
  location?: string;
}

export function UnifiedValuationHeader({
  vehicleInfo,
  estimatedValue,
  confidenceScore = 85,
  bestPhotoUrl,
  photoScore,
  photoCondition,
  calculationInProgress = false,
  photoSubmitted = false,
  isPremium = false,
  onShare,
  onDownload,
  onSaveToAccount,
  isSaving = false,
  displayMode = 'detailed',
  location,
}: UnifiedValuationHeaderProps) {
  // Construct vehicle name string
  const vehicleName = `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}${vehicleInfo.trim ? ` ${vehicleInfo.trim}` : ''}`;
  
  // Construct vehicle specs string
  const vehicleSpecs = vehicleInfo.mileage 
    ? `${vehicleInfo.mileage.toLocaleString()} miles • ${photoCondition?.condition || vehicleInfo.condition || 'Good'} condition`
    : `${photoCondition?.condition || vehicleInfo.condition || 'Good'} condition`;
  
  // Increase confidence score when photo is submitted
  const displayConfidenceScore = photoSubmitted ? Math.min(confidenceScore + 7, 99) : confidenceScore;

  // Simple card display mode
  if (displayMode === 'card') {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{vehicleName}</h2>
          <p className="text-muted-foreground text-sm">{vehicleSpecs}</p>
          {location && <p className="text-muted-foreground text-sm">Location: {location}</p>}
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Estimated Value</p>
          <p className="text-3xl font-bold text-primary">
            {calculationInProgress 
              ? <span className="text-gray-400">Calculating...</span>
              : estimatedValue
                ? formatCurrency(estimatedValue)
                : '$0'
            }
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            {displayConfidenceScore}% confidence
          </div>
        </div>
        
        {onDownload && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
        )}
      </Card>
    );
  }

  // Simple display mode (used in premium form)
  if (displayMode === 'simple') {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold">{vehicleName}</h1>
            <p className="text-gray-600 text-sm">{vehicleSpecs}</p>
          </div>
          
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {calculationInProgress 
                ? <span className="text-gray-400">Calculating...</span>
                : estimatedValue 
                  ? formatCurrency(estimatedValue)
                  : '$0'
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {displayConfidenceScore}% confidence
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed display mode (default)
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 flex items-center gap-2">
            {vehicleName}
            {isPremium && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                Premium
              </span>
            )}
          </h1>
          {vehicleSpecs && <p className="text-gray-600">{vehicleSpecs}</p>}
        </div>
        
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {calculationInProgress 
              ? <span className="text-gray-400">Calculating...</span>
              : estimatedValue 
                ? formatCurrency(estimatedValue)
                : '$0'
            }
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {displayConfidenceScore}% confidence
          </div>
        </div>
      </div>
      
      {(onShare || onDownload || onSaveToAccount) && (
        <>
          <Separator className="my-4" />
          
          <div className="flex flex-wrap gap-2">
            {onShare && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={onShare}
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            )}
            
            {onSaveToAccount && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={onSaveToAccount}
                disabled={isSaving}
              >
                <Download className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
            )}
            
            {onDownload && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Export as both named and default export for compatibility
export default UnifiedValuationHeader;
