import React, { useState, useEffect, useCallback } from 'react';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';
import { Button } from '@/components/ui/button';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import { AIConditionAssessment } from './AIConditionAssessment';
import { useAICondition } from '@/hooks/useAICondition';

interface ValuationResultProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
  valuationId?: string;
}

const ValuationResult: React.FC<ValuationResultProps> = ({
  make,
  model,
  year,
  mileage,
  condition,
  location,
  valuation,
  valuationId,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { conditionData, isLoading: isLoadingCondition } = useAICondition(valuationId);

  const fetchExplanation = useCallback(async () => {
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
    fetchExplanation();
  }, [fetchExplanation]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Prepare the vehicle information and valuation data
      const vehicleInfo = {
        vin: 'MANUAL-ENTRY', // Placeholder for manual entries
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
        confidenceScore: 80, // Default value
        adjustments: [],
        fuelType: 'Not Specified',
        explanation: explanation, // Add the explanation to the valuation data
        aiCondition: conditionData // Pass AI condition data to the PDF generator
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Valuation Result</h2>
      <p className="mb-4">
        A {year} {make} {model} with {mileage.toLocaleString()} miles in{' '}
        <span className="capitalize">{condition}</span> condition in {location} is
        valued at <span className="font-bold">${valuation.toLocaleString()}</span>.
      </p>
      
      {/* AI Condition Assessment */}
      {valuationId && (
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
      
      <Button 
        onClick={handleDownloadPdf}
        disabled={isDownloading || loading || !!error}
        className="w-full mt-4"
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
    </div>
  );
};

export default ValuationResult;
