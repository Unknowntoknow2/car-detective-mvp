
import React, { useEffect } from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { FormData } from '@/types/premium-valuation';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
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
  } = useValuationResult(valuationId || '');

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

  if (isError || !result) {
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
  let priceRange: [number, number];
  const estimatedValue = result.estimatedValue || 0;
  
  if (result.price_range) {
    if (Array.isArray(result.price_range)) {
      priceRange = [
        Number(result.price_range[0]), 
        Number(result.price_range[1])
      ];
    } else if ('min' in result.price_range && 'max' in result.price_range) {
      priceRange = [
        Number(result.price_range.min), 
        Number(result.price_range.max)
      ];
    } else if ('low' in result.price_range && 'high' in result.price_range) {
      priceRange = [
        Number(result.price_range.low), 
        Number(result.price_range.high)
      ];
    } else {
      priceRange = [
        Math.round(estimatedValue * 0.95),
        Math.ceil(estimatedValue * 1.05)
      ];
    }
  } else {
    priceRange = [
      Math.round(estimatedValue * 0.95),
      Math.ceil(estimatedValue * 1.05)
    ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Valuation Results</h2>
        <p className="text-gray-600 mb-6">
          Based on your vehicle details, our AI pricing model has generated the following valuation.
        </p>
      </div>

      <UnifiedValuationResult
        valuationId={valuationId || ''}
        displayMode="full"
        estimatedValue={estimatedValue}
        confidenceScore={result.confidenceScore || 0}
        priceRange={priceRange}
        adjustments={result.adjustments || []}
        vehicleInfo={{
          year: result.year,
          make: result.make,
          model: result.model,
          mileage: result.mileage,
          condition: result.condition
        }}
        onDownloadPdf={handleDownloadPdf}
        onEmailReport={handleEmailPdf}
      />
    </div>
  );
}
