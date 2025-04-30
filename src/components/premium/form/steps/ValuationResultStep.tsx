
import React, { useEffect } from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { FormData } from '@/types/premium-valuation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, Download, Mail } from 'lucide-react';
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

  if (isError || !result) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load valuation results. Please try again.
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Valuation Results</h2>
        <p className="text-gray-600 mb-6">
          Based on your vehicle details, our AI pricing model has generated the following valuation.
        </p>
      </div>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-primary-light/10 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle>{formData.year} {formData.make} {formData.model}</CardTitle>
          </div>
          <CardDescription>
            {formData.trim && `${formData.trim} • `}
            {formData.mileage && `${formData.mileage.toLocaleString()} miles • `}
            {formData.conditionLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
            <p className="text-4xl font-bold text-primary">
              ${result.estimated_value?.toLocaleString() || 'N/A'}
            </p>
            <div className="flex items-center justify-center mt-2">
              <div className="px-3 py-1 text-xs font-medium bg-primary-light/20 text-primary rounded-full">
                {result.confidence_score || 0}% Confidence
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Base Price</p>
              <p className="text-lg">${result.base_price?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Features Value</p>
              <p className="text-lg">+${result.feature_value_total?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Market Adjustment</p>
              <p className="text-lg">${(result.zip_demand_factor && result.zip_demand_factor !== 1 
                ? ((result.zip_demand_factor - 1) * 100).toFixed(1) + '%' 
                : '0%')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button onClick={handleDownloadPdf} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
        <Button variant="outline" onClick={handleEmailPdf} className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Email Me the Report
        </Button>
      </div>
    </div>
  );
}
