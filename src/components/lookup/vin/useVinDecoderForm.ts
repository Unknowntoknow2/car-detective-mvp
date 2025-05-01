
import { useState } from 'react';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { toast } from 'sonner';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { convertVehicleInfoToReportData } from '@/utils/pdf';
import { convertAdjustmentsToLegacyFormat } from '@/utils/formatters/adjustment-formatter';

export const useVinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { result, isLoading, error, lookupVin } = useVinDecoder();
  const [carfaxData, setCarfaxData] = useState(null);
  const [isLoadingCarfax, setIsLoadingCarfax] = useState(false);
  const [carfaxError, setCarfaxError] = useState(null);
  
  // Add the valuation pipeline for enhanced functionality
  const {
    stage,
    vehicle: pipelineVehicle,
    requiredInputs,
    valuationResult,
    error: valuationError,
    isLoading: pipelineLoading,
    runLookup,
    submitValuation
  } = useFullValuationPipeline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin) {
      setCarfaxData(null);
      setCarfaxError(null);
      
      // Original VIN lookup for backward compatibility
      await lookupVin(vin);
      
      // Also run our new valuation pipeline
      await runLookup('vin', vin);
      
      // Fetch CARFAX data after VIN lookup succeeds
      try {
        setIsLoadingCarfax(true);
        const carfaxReport = await getCarfaxReport(vin);
        setCarfaxData(carfaxReport);
        setIsLoadingCarfax(false);
      } catch (err) {
        console.error('Error fetching CARFAX data:', err);
        setCarfaxError('Unable to retrieve vehicle history report.');
        setIsLoadingCarfax(false);
        toast.error('Could not retrieve vehicle history report.');
      }
    }
  };

  // Modified function signature to return Promise<void> to fix type error
  const handleDetailsSubmit = async (details: any): Promise<void> => {
    const result = await submitValuation({
      ...details,
      // Add Carfax data if available
      carfaxData: carfaxData || undefined
    });
    // We don't return the result anymore, making it void
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const reportData = convertVehicleInfoToReportData(result, {
      mileage: requiredInputs?.mileage || 76000,
      estimatedValue: valuationResult?.estimated_value || 24500,
      condition: requiredInputs?.conditionLabel || "Good",
      zipCode: requiredInputs?.zipCode || "10001",
      confidenceScore: valuationResult?.confidence_score || (carfaxData ? 92 : 85),
      adjustments: valuationResult?.adjustments 
        ? convertAdjustmentsToLegacyFormat(valuationResult.adjustments)
        : [
            { label: "Mileage", value: -3.5 },
            { label: "Condition", value: 2.0 },
            { label: "Market Demand", value: 4.0 },
            ...(carfaxData && carfaxData.accidentsReported > 0 ? [{ label: "Accident History", value: -3.0 }] : [])
          ],
      carfaxData: carfaxData // Pass CARFAX data to PDF generator
    });
    
    toast.success("PDF report generated successfully!");
    return reportData;
  };

  return {
    vin,
    setVin,
    result,
    isLoading,
    error,
    carfaxData,
    isLoadingCarfax,
    carfaxError,
    stage,
    pipelineVehicle,
    requiredInputs,
    valuationResult,
    valuationError,
    pipelineLoading,
    handleSubmit,
    handleDetailsSubmit,
    submitValuation,
    handleDownloadPdf
  };
};
