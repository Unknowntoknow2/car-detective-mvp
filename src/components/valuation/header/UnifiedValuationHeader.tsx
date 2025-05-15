
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Share, Save, Camera } from 'lucide-react';
import { AICondition } from '@/types/photo';
import { formatCurrency } from '@/utils/format';

export interface VehicleInfoProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition?: string;
  trim?: string;
}

interface UnifiedValuationHeaderProps {
  vehicleInfo: VehicleInfoProps | {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    condition?: string;
    trim?: string;
  };
  estimatedValue: number;
  confidenceScore: number;
  photoCondition?: AICondition | null;
  isPremium?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  onSaveToAccount?: () => void;
  isSaving?: boolean;
  photoSubmitted?: boolean;
  calculationInProgress?: boolean;
  bestPhotoUrl?: string;
}

export function UnifiedValuationHeader({
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  photoCondition,
  isPremium = false,
  onShare,
  onDownload,
  onSaveToAccount,
  isSaving = false,
  photoSubmitted = false,
  calculationInProgress = false,
  bestPhotoUrl
}: UnifiedValuationHeaderProps) {
  // Ensure mileage is a valid number
  const mileage = vehicleInfo.mileage || 0;
  
  return (
    <Card className="border-primary/10 bg-card">
      <CardContent className="p-6">
        <div className="md:flex justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center">
              {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              {vehicleInfo.trim && <span className="ml-1 text-muted-foreground">{vehicleInfo.trim}</span>}
            </h2>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-muted-foreground">
              <div className="flex items-center">
                <span className="text-sm">{mileage.toLocaleString()} miles</span>
              </div>
              
              {photoSubmitted && (
                <div className="flex items-center">
                  <Camera className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm">
                    {photoCondition ? 
                      `AI condition: ${photoCondition.condition}` :
                      'Photos submitted'
                    }
                  </span>
                </div>
              )}
              
              {/* Confidence score indicator */}
              <div className="flex items-center">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {confidenceScore}% Confidence
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:text-right">
            <div className="flex items-baseline justify-between md:justify-end md:flex-col">
              <div className="text-xs text-muted-foreground mb-1 mr-2 md:mr-0">Estimated Value</div>
              <div className="text-3xl font-bold">
                {calculationInProgress ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-lg">Recalculating...</span>
                  </div>
                ) : (
                  formatCurrency(estimatedValue)
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex mt-4 gap-2 justify-end">
              {onShare && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onShare}
                  className="flex gap-1.5"
                >
                  <Share className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              )}
              
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="flex gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              )}
              
              {onSaveToAccount && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onSaveToAccount}
                  disabled={isSaving}
                  className="flex gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Optional: Best photo preview */}
        {bestPhotoUrl && isPremium && (
          <div className="mt-4">
            <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-md">
              <img 
                src={bestPhotoUrl} 
                alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UnifiedValuationHeader;
