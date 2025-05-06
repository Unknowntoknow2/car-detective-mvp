
import React, { useState, useEffect } from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ValuationResults } from '@/components/premium/common/ValuationResults';
import { PremiumDownloadButton } from '@/components/premium/PremiumDownloadButton';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import { useAICondition } from '@/hooks/useAICondition';
import { supabase } from '@/integrations/supabase/client';
import { useValuationId } from './result/useValuationId';
import { LoadingState } from './result/LoadingState';
import { ErrorAlert } from './result/ErrorAlert';

interface PredictionResultProps {
  valuationId: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Get valuation ID (from prop or localStorage)
  const { localValuationId } = useValuationId(valuationId);

  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useValuationResult(localValuationId || '');
  
  const { 
    conditionData, 
    isLoading: isLoadingCondition 
  } = useAICondition(localValuationId);

  // Retry logic if data fetch fails
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Retrying valuation fetch (attempt ${retryCount + 1}/3)...`);
        refetch();
        setRetryCount(prev => prev + 1);
      }, 1000 * (retryCount + 1)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, refetch]);

  const handleDownloadPdf = async () => {
    if (!data) return;
    
    setIsDownloading(true);
    try {
      // Prepare the vehicle information and valuation data
      const vehicleInfo = {
        vin: data.id || 'VALUATION-ID',
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        transmission: 'Not Specified',
        condition: data.condition,
        zipCode: data.zipCode
      };

      // Prepare valuation data for PDF generation
      const valuationData = {
        estimatedValue: data.estimatedValue,
        mileage: data.mileage.toString(),
        condition: data.condition,
        zipCode: data.zipCode,
        confidenceScore: data.confidenceScore || 75,
        adjustments: data.adjustments || [],
        fuelType: 'Not Specified',
        explanation: 'Detailed valuation report for your vehicle', 
        aiCondition: conditionData
      };

      // Convert to report data format
      const reportData = convertVehicleInfoToReportData(vehicleInfo, valuationData);
      
      // Generate and download the PDF
      await downloadPdf(reportData);
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error?.message || "Failed to load valuation data"}</p>
          <div className="mt-2">
            <button 
              onClick={() => refetch()} 
              className="px-3 py-1 text-sm bg-white text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              {retryCount >= 3 ? "Try Again" : <div className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Retrying...</div>}
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ValuationResults
        estimatedValue={data.estimatedValue}
        confidenceScore={data.confidenceScore || 75}
        priceRange={data.priceRange}
        adjustments={data.adjustments}
        aiVerified={!!conditionData && conditionData.confidenceScore > 70}
        aiCondition={conditionData}
      />
      
      <div className="mt-6">
        <PremiumDownloadButton 
          valuationId={localValuationId}
          onDownload={handleDownloadPdf}
          className="w-full"
          isDownloading={isDownloading}
        />
      </div>
    </div>
  );
}
