// ✅ File: src/components/lookup/vin/useVinDecoderForm.ts

import { useState } from 'react';
import { toast } from 'sonner';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';

export function useVinDecoderForm() {
  const [vin, setVin] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [carfaxData, setCarfaxData] = useState<any>(null);
  const [carfaxError, setCarfaxError] = useState<string | null>(null);
  const [isLoadingCarfax, setIsLoadingCarfax] = useState(false);

  const {
    result,
    isLoading,
    error,
    lookupVin,
    valuationId,
  } = useVinDecoder();

  const {
    stage,
    vehicle: pipelineVehicle,
    requiredInputs,
    valuationResult,
    error: valuationError,
    isLoading: pipelineLoading,
    runLookup,
    submitValuation,
  } = useFullValuationPipeline();

  // ✅ VIN → Decode → Pipeline → Save to LocalStorage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin) {
      toast.error('Please enter a valid VIN');
      return;
    }

    try {
      setCarfaxData(null);
      setCarfaxError(null);

      const decoded = await lookupVin(vin);
      if (!decoded) {
        toast.error('VIN lookup failed. Try again.');
        return;
      }

      await runLookup('vin', vin);

      setIsLoadingCarfax(true);
      const report = await getCarfaxReport(vin);
      setCarfaxData(report);
      setIsLoadingCarfax(false);
    } catch (err) {
      console.error('CARFAX error:', err);
      setCarfaxError('Unable to retrieve vehicle history report.');
      setIsLoadingCarfax(false);
      toast.error('Could not retrieve vehicle history report.');
    }

    if (valuationResult?.id && result) {
      localStorage.setItem('latest_valuation_id', valuationResult.id);
      localStorage.setItem(`vin_lookup_${vin}`, JSON.stringify(result));
    }
  };

  const handleDetailsSubmit = async (details: any): Promise<void> => {
    await submitValuation({
      ...details,
      zipCode: zipCode || details.zipCode,
      carfaxData: carfaxData || undefined,
    });
  };

  return {
    vin,
    setVin,
    zipCode,
    setZipCode,
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
    valuationId,
  };
}
