
import React, { useState } from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ValuationResults } from '@/components/premium/common/ValuationResults';
import { PremiumDownloadButton } from '@/components/premium/PremiumDownloadButton';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import { useAICondition } from '@/hooks/useAICondition';

interface PredictionResultProps {
  valuationId: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const { data, isLoading, error } = useValuationResult(valuationId);
  const { conditionData } = useAICondition(valuationId);
  const [isDownloading, setIsDownloading] = useState(false);

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
        <AlertDescription>
          {error?.message || "Failed to load valuation data"}
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
          valuationId={valuationId}
          onDownload={handleDownloadPdf}
          className="w-full"
        />
      </div>
    </div>
  );
}
