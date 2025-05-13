
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share, Save, Shield, Check } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { AIConditionBadge } from "../AIConditionBadge";
import { VehicleInfoProps } from "../UnifiedValuationResult";

export interface UnifiedValuationHeaderProps {
  vehicleInfo: VehicleInfoProps;
  estimatedValue: number;
  confidenceScore: number;
  photoCondition?: any;
  isPremium?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  onSaveToAccount?: () => Promise<void>;
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
  // Get condition color class
  const getConditionColorClass = (condition: string | undefined): string => {
    switch (condition) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-amber-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <div className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10" 
             style={{ backgroundImage: 'url(/images/grid-pattern.svg)', opacity: 0.4 }} />
        
        <CardContent className="relative p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Vehicle info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h2>
                {isPremium && (
                  <Badge variant="secondary" className="ml-2">
                    <Shield className="h-3.5 w-3.5 mr-1 text-primary" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {vehicleInfo.mileage && (
                  <span className="flex items-center">
                    {vehicleInfo.mileage.toLocaleString()} miles
                  </span>
                )}
                
                {vehicleInfo.condition && (
                  <>
                    <span className="mx-1.5">•</span>
                    <span className={`font-medium ${getConditionColorClass(vehicleInfo.condition)}`}>
                      {vehicleInfo.condition} Condition
                    </span>
                  </>
                )}
                
                {photoCondition && photoCondition.condition && (
                  <AIConditionBadge 
                    condition={photoCondition.condition}
                    confidenceScore={photoCondition.confidenceScore}
                  />
                )}
              </div>
            </div>
            
            {/* Valuation price */}
            <div className="bg-primary/10 px-4 py-2 rounded-lg flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Estimated Value</span>
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                {calculationInProgress ? 'Calculating...' : formatCurrency(estimatedValue)}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          {(onShare || onDownload || onSaveToAccount) && (
            <div className="flex flex-wrap gap-2 mt-5">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              
              {onSaveToAccount && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onSaveToAccount}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <div className="h-3.5 w-3.5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Dashboard
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

export default UnifiedValuationHeader;
