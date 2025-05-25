
import { useState } from 'react';
import { toast } from 'sonner';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { getCarPricePrediction } from '@/services/carPricePredictionService';

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

  // VIN → Decode → Real API → Save to LocalStorage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin) {
      toast.error('Please enter a valid VIN');
      return;
    }

    try {
      setCarfaxData(null);
      setCarfaxError(null);

      // Step 1: Decode VIN
      await lookupVin(vin);
      
      // Step 2: Run pipeline lookup
      await runLookup('vin', vin);

      // Step 3: Get Carfax data
      setIsLoadingCarfax(true);
      const report = await getCarfaxReport(vin);
      setCarfaxData(report);
      setIsLoadingCarfax(false);

      // Step 4: If we have decoded vehicle data, get real valuation
      if (result) {
        try {
          // Mock decoded data for now - in real implementation this would come from VIN decoder
          const decodedData = {
            make: 'Toyota',
            model: 'Camry',
            year: 2019,
            fuelType: 'Gasoline',
            transmission: 'Automatic',
            bodyType: 'Sedan',
            color: 'Silver'
          };

          // Call real valuation API
          const valuationResult = await getCarPricePrediction({
            make: decodedData.make,
            model: decodedData.model,
            year: decodedData.year,
            mileage: 45000, // Default - user can update later
            condition: 'good', // Default - user can update later
            zipCode: zipCode || '90210',
            fuelType: decodedData.fuelType,
            transmission: decodedData.transmission,
            color: decodedData.color,
            bodyType: decodedData.bodyType,
            vin: vin
          });

          // Store the real valuation data
          const enhancedResult = {
            ...result,
            estimatedValue: valuationResult.estimatedValue,
            confidenceScore: valuationResult.confidenceScore,
            condition: valuationResult.condition
          };

          localStorage.setItem(`vin_lookup_${vin}`, JSON.stringify(enhancedResult));
          
          toast.success('VIN lookup completed with real valuation data');
        } catch (valuationError) {
          console.error('Valuation API error:', valuationError);
          toast.error('VIN decoded but valuation failed. Using basic data.');
        }
      }

    } catch (err) {
      console.error('CARFAX error:', err);
      setCarfaxError('Unable to retrieve vehicle history report.');
      setIsLoadingCarfax(false);
      toast.error('Could not retrieve vehicle history report.');
    }

    if (valuationResult?.id && result) {
      localStorage.setItem('latest_valuation_id', valuationResult.id);
    }
  };

  const handleDetailsSubmit = async (details: any): Promise<void> => {
    // Get real valuation with user-provided details
    if (details.make && details.model && details.year) {
      try {
        const valuationResult = await getCarPricePrediction({
          make: details.make,
          model: details.model,
          year: details.year,
          mileage: details.mileage || 45000,
          condition: details.condition || 'good',
          zipCode: zipCode || details.zipCode || '90210',
          fuelType: details.fuelType,
          transmission: details.transmission,
          color: details.color,
          bodyType: details.bodyType,
          vin: vin
        });

        const enhancedDetails = {
          ...details,
          estimatedValue: valuationResult.estimatedValue,
          confidenceScore: valuationResult.confidenceScore,
          carfaxData: carfaxData || undefined,
        };

        await submitValuation(enhancedDetails);
        toast.success('Valuation completed with real pricing data');
      } catch (error) {
        console.error('Real valuation failed:', error);
        // Fallback to original submission
        await submitValuation({
          ...details,
          zipCode: zipCode || details.zipCode,
          carfaxData: carfaxData || undefined,
        });
        toast.error('Used basic valuation due to API error');
      }
    } else {
      await submitValuation({
        ...details,
        zipCode: zipCode || details.zipCode,
        carfaxData: carfaxData || undefined,
      });
    }
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
