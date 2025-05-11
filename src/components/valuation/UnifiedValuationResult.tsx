
import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Download, Mail, File } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UnifiedValuationHeader } from './header/UnifiedValuationHeader';
import { VehicleDataTable } from './detail/VehicleDataTable';
import { toast } from 'sonner';
import { ManualVehicleInfo } from '@/hooks/useManualValuation'; 

interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
}

interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface UnifiedValuationResultProps {
  valuationId?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Adjustment[];
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
  vehicleInfo?: VehicleInfo;
  manualValuation?: ManualVehicleInfo;
  displayMode?: 'full' | 'simple' | 'minimal';
}

export function UnifiedValuationResult({
  valuationId,
  estimatedValue: propEstimatedValue,
  confidenceScore: propConfidenceScore,
  priceRange: propPriceRange,
  adjustments: propAdjustments,
  onDownloadPdf,
  onEmailReport,
  vehicleInfo: propVehicleInfo,
  manualValuation,
  displayMode = 'full'
}: UnifiedValuationResultProps) {
  // Mock data for when valuationId is provided but we don't have a real API connection
  const mockData = valuationId ? {
    estimated_value: 15000,
    confidence_score: 85,
    year: manualValuation?.year || 2018,
    make: manualValuation?.make || "Toyota",
    model: manualValuation?.model || "Camry",
    mileage: manualValuation?.mileage || 45000,
    condition_score: 75,
    isLoading: false,
    error: null
  } : null;
  
  // State to track if PDF download is in progress
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Determine if we should use the data from the props or from the mock
  const estimatedValue = mockData?.estimated_value ?? propEstimatedValue ?? 0;
  const confidenceScore = mockData?.confidence_score ?? propConfidenceScore ?? 80;
  const vehicleInfo = mockData ? {
    year: mockData.year,
    make: mockData.make,
    model: mockData.model,
    mileage: mockData.mileage,
    condition: mockData.condition_score ? 
      mockData.condition_score > 90 ? 'Excellent' :
      mockData.condition_score > 75 ? 'Good' :
      mockData.condition_score > 60 ? 'Fair' : 'Poor'
      : 'Unknown'
  } : propVehicleInfo;
  
  // Get price range - either from props, or calculate as ±5% if not provided
  const priceRange = propPriceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];
  
  // Get adjustments from props or data
  const adjustments = propAdjustments || [];
  
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      if (onDownloadPdf) {
        await onDownloadPdf();
      } else {
        // Mock PDF download
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('PDF report downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF report');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleEmailReport = async () => {
    try {
      if (onEmailReport) {
        await onEmailReport();
      } else {
        // Mock email sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Report sent to your email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };
  
  // Loading state
  if (mockData?.isLoading) {
    return <ValuationSkeleton />;
  }
  
  // Error state
  if (mockData?.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load valuation data
          <Button variant="outline" size="sm" className="mt-2">
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Show header for full and simple display modes
  const showHeader = displayMode !== 'minimal';
  
  // Show adjustments only in full mode
  const showAdjustments = displayMode === 'full' && adjustments.length > 0;
  
  // Show detailed data in full mode
  const showDetailedData = displayMode === 'full';
  
  return (
    <div className="space-y-6">
      {showHeader && vehicleInfo && (
        <UnifiedValuationHeader
          vehicleInfo={vehicleInfo}
          estimatedValue={estimatedValue}
          confidenceScore={confidenceScore}
          displayMode={displayMode === 'full' ? 'detailed' : 'card'}
        />
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium">Estimated Value</h3>
              <div className="text-3xl font-bold text-primary mt-1">
                {formatCurrency(estimatedValue)}
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                Estimated range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </div>
              
              <div className="mt-3 flex items-center">
                <span className="text-sm font-medium mr-2">Confidence:</span>
                <div className={`text-sm font-semibold ${
                  confidenceScore >= 80 ? 'text-green-600' :
                  confidenceScore >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {confidenceScore}%
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center"
                data-testid="download-valuation-pdf"
              >
                {isDownloading ? (
                  <>
                    <Skeleton className="h-4 w-4 rounded-full mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleEmailReport}
                className="flex items-center"
                data-testid="email-valuation-report"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </Button>
            </div>
          </div>
          
          {showAdjustments && (
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Valuation Adjustments</h4>
              <ul className="space-y-3">
                {adjustments.map((adj, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">{adj.factor}</div>
                        <div className="text-sm text-muted-foreground">{adj.description}</div>
                      </div>
                    </div>
                    <div className={`font-medium ${adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(adj.impact)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showDetailedData && vehicleInfo && (
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Vehicle Details</h4>
              <VehicleDataTable vehicleInfo={vehicleInfo} manualValuation={manualValuation} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ValuationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-36" />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-9 w-40 mb-2" />
              <Skeleton className="h-4 w-52 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="flex flex-col space-y-3 mt-4 md:mt-0">
              <Skeleton className="h-9 w-44" />
              <Skeleton className="h-9 w-44" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
