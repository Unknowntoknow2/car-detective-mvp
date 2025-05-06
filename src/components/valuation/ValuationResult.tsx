
import React, { useState, useEffect, useCallback } from 'react';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';
import { Button } from '@/components/ui/button';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import { AIConditionAssessment } from './AIConditionAssessment';
import { useAICondition } from '@/hooks/useAICondition';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ShareableLink } from './ShareableLink';
import { useValuationResult } from '@/hooks/useValuationResult';
import { ValuationResultProps } from '@/types/valuation-result';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId,
  make: propMake,
  model: propModel,
  year: propYear,
  mileage: propMileage,
  condition: propCondition,
  location: propLocation,
  valuation: propValuation,
  isManualValuation = false,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [localValuationId, setLocalValuationId] = useState<string | undefined>(valuationId);
  
  // Fallback data if no valuation ID is provided
  const [fallbackData, setFallbackData] = useState({
    make: propMake || '',
    model: propModel || '',
    year: propYear || 0,
    mileage: propMileage || 0,
    condition: propCondition || '',
    location: propLocation || '',
    valuation: propValuation || 0
  });
  
  // Fetch valuation data from Supabase if valuationId is provided
  const { data: valuationDataResult, isLoading: isLoadingValuation } = 
    useValuationResult(localValuationId || '');
    
  const { conditionData, isLoading: isLoadingCondition } = 
    useAICondition(localValuationId);

  // Try to recover valuationId from localStorage if not provided
  useEffect(() => {
    if (!localValuationId) {
      const storedValuation = localStorage.getItem('latest_valuation_id');
      if (storedValuation) {
        setLocalValuationId(storedValuation);
      }
    }
  }, [localValuationId]);

  // Use valuation data or fallback to props
  const valuationData = valuationDataResult;
  const make = valuationData?.make || fallbackData.make;
  const model = valuationData?.model || fallbackData.model;
  const year = valuationData?.year || fallbackData.year;
  const mileage = valuationData?.mileage || fallbackData.mileage;
  const condition = valuationData?.condition || fallbackData.condition;
  const location = valuationData?.zipCode || fallbackData.location;
  const valuation = valuationData?.estimatedValue || fallbackData.valuation;

  const fetchExplanation = useCallback(async () => {
    if (!make || !model) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await generateValuationExplanation({
        make,
        model,
        year,
        mileage,
        condition,
        location,
        valuation,
      });
      setExplanation(result);
    } catch (e: any) {
      console.error(e);
      setError('Failed to load explanation: ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  }, [make, model, year, mileage, condition, location, valuation]);

  useEffect(() => {
    if (make && model && year && mileage) {
      fetchExplanation();
    }
  }, [fetchExplanation, make, model, year, mileage]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Prepare the vehicle information and valuation data
      const vehicleInfo = {
        vin: localValuationId || 'MANUAL-ENTRY',
        make,
        model,
        year,
        mileage,
        transmission: 'Unknown', // Default value
        condition,
        zipCode: location
      };

      // Prepare valuation data for PDF generation
      const valuationData = {
        estimatedValue: valuation,
        mileage: mileage.toString(),
        condition,
        zipCode: location,
        confidenceScore: valuationDataResult?.confidenceScore || 80, // Default value
        adjustments: valuationDataResult?.adjustments || [],
        fuelType: 'Not Specified',
        explanation: explanation,
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

  const handleRegenerateExplanation = () => {
    fetchExplanation();
  };

  // If we're still loading valuation data and have an ID, show loading state
  if (isLoadingValuation && localValuationId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading valuation results...</p>
      </div>
    );
  }

  // If we have no data at all, show error
  if (!make || !model || !year || !mileage) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing vehicle information</AlertTitle>
        <AlertDescription>
          Unable to display valuation result due to missing vehicle information.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Valuation Result</h2>
      <p className="mb-4">
        A {year} {make} {model} with {mileage.toLocaleString()} miles in{' '}
        <span className="capitalize">{condition}</span> condition in {location} is
        valued at <span className="font-bold">${valuation.toLocaleString()}</span>.
      </p>
      
      {/* AI Condition Assessment */}
      {localValuationId && (
        <AIConditionAssessment 
          conditionData={conditionData} 
          isLoading={isLoadingCondition} 
        />
      )}
      
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Why this price?</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRegenerateExplanation}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Explanation
              </>
            )}
          </Button>
        </div>
        
        {loading ? (
          <p className="italic text-gray-500">Generating explanation...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="mb-6 whitespace-pre-wrap">{explanation}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          onClick={handleDownloadPdf}
          disabled={isDownloading || loading || !!error}
          className="flex-1"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </>
          )}
        </Button>
        
        {/* Add Share button only if valuationId exists */}
        {localValuationId && (
          <ShareableLink valuationId={localValuationId} />
        )}
      </div>

      {/* Add Car Detective Chat Bubble */}
      {localValuationId && (
        <ChatBubble 
          valuationId={localValuationId} 
          initialMessage="Tell me about my car's valuation"
        />
      )}
    </div>
  );
};

export default ValuationResult;
