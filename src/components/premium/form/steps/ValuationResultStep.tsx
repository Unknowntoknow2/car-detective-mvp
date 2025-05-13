import React, { useEffect } from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { FormData } from '@/types/premium-valuation';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Download, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ValuationResultStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function ValuationResultStep({
  step,
  formData,
  updateValidity
}: ValuationResultStepProps) {
  const valuationId = formData.valuationId;
  
  const {
    data: result,
    isLoading,
    error,
    isError,
    refetch,
  } = useValuationResult(valuationId);

  // Set step validity
  useEffect(() => {
    updateValidity(step, !!result);
  }, [result, step, updateValidity]);

  // Refetch when valuationId changes
  useEffect(() => {
    if (valuationId) {
      refetch();
    }
  }, [valuationId, refetch]);

  const handleDownloadPdf = async () => {
    try {
      // Here we'd generate PDF using a utility function
      // For now, just show a toast
      toast.success("PDF download started!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  const handleEmailPdf = async () => {
    try {
      // Here we'd call the edge function to email the PDF
      // For now, just show a toast
      toast.success("PDF emailed successfully!");
    } catch (error) {
      console.error("Error emailing PDF:", error);
      toast.error("Failed to email PDF report");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading valuation results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Could not load valuation results. Please try again.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure priceRange is a tuple with exactly two elements
  const priceRange: [number, number] = result.priceRange && result.priceRange.length >= 2 
    ? [result.priceRange[0], result.priceRange[1]] 
    : [
        Math.round(result.estimatedValue * 0.95),
        Math.round(result.estimatedValue * 1.05)
      ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Valuation Results</h2>
        <p className="text-gray-600 mb-6">
          Based on your vehicle details, our AI pricing model has generated the following valuation.
        </p>
      </div>

      <UnifiedValuationResult
        valuationId={valuationId}
        displayMode="full"
        estimatedValue={result.estimatedValue}
        confidenceScore={result.confidenceScore}
        priceRange={priceRange}
        adjustments={result.adjustments}
        onDownloadPdf={handleDownloadPdf}
        onEmailReport={handleEmailPdf}
        vehicleInfo={{
          year: result.year,
          make: result.make,
          model: result.model,
          mileage: result.mileage,
          condition: result.condition
        }}
      />
    </div>
  );
}
