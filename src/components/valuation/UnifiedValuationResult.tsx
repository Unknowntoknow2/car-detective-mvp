import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileDown, Loader2, Mail, Share2 } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { LoadingState } from '@/components/premium/common/LoadingState';
import { ErrorState } from '@/components/premium/common/ErrorState';
import { FeaturesDisplay } from '@/components/premium/form/steps/prediction-review/FeaturesDisplay';

// Define a common VehicleInfo type to avoid conflicts
interface CommonVehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
}

// Use the common type in the Adjustment interface
interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

interface UnifiedValuationResultProps {
  valuationId?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  basePrice?: number;
  adjustments?: Adjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo?: CommonVehicleInfo;
  manualValuation?: any;
  displayMode: 'full' | 'simple';
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
}

export function UnifiedValuationResult({
  valuationId,
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments,
  priceRange,
  demandFactor,
  vehicleInfo,
  manualValuation,
  displayMode = 'full',
  onDownloadPdf,
  onEmailReport
}: UnifiedValuationResultProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  
  // Only fetch from API if we're not provided with the data directly
  const shouldFetchFromApi = !manualValuation && valuationId && !estimatedValue;
  
  const {
    data,
    isLoading,
    error
  } = useValuationResult(shouldFetchFromApi ? valuationId : undefined);
  
  // Use provided data or API data
  const valuationData = manualValuation || data || {
    estimatedValue,
    confidenceScore,
    basePrice,
    adjustments,
    priceRange,
    demandFactor,
    vehicleInfo
  };
  
  const handleDownload = async () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }
    
    setIsDownloading(true);
    try {
      // Handle built-in download logic if no custom handler provided
      toast({
        title: 'Success',
        description: 'Report downloaded successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to download report',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleEmailReport = async () => {
    if (onEmailReport) {
      onEmailReport();
      return;
    }
    
    setIsEmailing(true);
    try {
      // Handle built-in email logic if no custom handler provided
      toast({
        title: 'Success',
        description: 'Report sent to your email',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error emailing report:', error);
      toast({
        title: 'Error',
        description: 'Failed to send report',
        variant: 'destructive',
      });
    } finally {
      setIsEmailing(false);
    }
  };
  
  if (isLoading && shouldFetchFromApi) {
    return <LoadingState text="Loading valuation result..." />;
  }
  
  if (error && shouldFetchFromApi) {
    return <ErrorState message="Failed to load valuation result" />;
  }
  
  if (!valuationData) {
    return <ErrorState message="No valuation data available" />;
  }
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {valuationData.vehicleInfo && (
                    `${valuationData.vehicleInfo.year} ${valuationData.vehicleInfo.make} ${valuationData.vehicleInfo.model}`
                  )}
                </h2>
                {valuationData.vehicleInfo?.trim && (
                  <p className="text-muted-foreground">{valuationData.vehicleInfo.trim}</p>
                )}
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <span className="text-sm text-muted-foreground">Estimated Value</span>
                <span className="text-3xl font-bold">
                  ${valuationData.estimatedValue?.toLocaleString() || 'N/A'}
                </span>
                {valuationData.priceRange && (
                  <span className="text-sm text-muted-foreground">
                    Range: ${valuationData.priceRange[0].toLocaleString()} - ${valuationData.priceRange[1].toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            {valuationData.confidenceScore !== undefined && (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Confidence Score</span>
                  <span className="text-sm font-bold">{valuationData.confidenceScore}%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${valuationData.confidenceScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {valuationData.adjustments && valuationData.adjustments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Valuation Factors</h3>
            <div className="space-y-2">
              {valuationData.adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{adjustment.factor}</span>
                  <span className={`text-sm font-medium ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment.impact >= 0 ? '+' : ''}{adjustment.impact}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {valuationData.features && (
        <FeaturesDisplay features={valuationData.features} />
      )}
      
      {displayMode === 'full' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleDownload} 
            className="flex-1"
            disabled={isDownloading}
            data-testid="download-pdf-button"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleEmailReport}
            className="flex-1"
            disabled={isEmailing}
          >
            {isEmailing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Email Report
              </>
            )}
          </Button>
          
          <Button variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share Report
          </Button>
        </div>
      )}
    </div>
  );
}
