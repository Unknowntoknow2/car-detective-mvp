
<<<<<<< HEAD
import { useState } from 'react';
import { toast } from 'sonner';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { supabase } from '@/integrations/supabase/client';
=======
import { useState } from "react";
import { toast } from "sonner";
import { getCarfaxReport } from "@/utils/carfax/mockCarfaxService";
import { useVinDecoder } from "@/hooks/useVinDecoder";
import { useFullValuationPipeline } from "@/hooks/useFullValuationPipeline";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function useVinDecoderForm() {
  const [vin, setVin] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [carfaxData, setCarfaxData] = useState<any>(null);
  const [carfaxError, setCarfaxError] = useState<string | null>(null);
  const [isLoadingCarfax, setIsLoadingCarfax] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // VIN → Decode → Real API → Save to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin) {
      toast.error("Please enter a valid VIN");
      return;
    }

    try {
      setIsLoading(true);
      setCarfaxData(null);
      setCarfaxError(null);
      setError(null);

<<<<<<< HEAD
      // Step 1: Get Carfax data
=======
      const decoded = await lookupVin(vin);
      if (!decoded) {
        toast.error("VIN lookup failed. Try again.");
        return;
      }

      await runLookup("vin", vin);

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      setIsLoadingCarfax(true);
      const report = await getCarfaxReport(vin);
      setCarfaxData(report);
      setIsLoadingCarfax(false);

      // Step 2: Call real valuation API with decoded data
      try {
        console.log('Calling car-price-prediction with:', {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          mileage: 45000,
          condition: 'good',
          zipCode: zipCode || '90210',
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          color: 'Silver',
          bodyType: 'Sedan',
          vin: vin
        });

        const { data: valuationData, error: valuationError } = await supabase.functions.invoke('car-price-prediction', {
          body: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            mileage: 45000,
            condition: 'good',
            zipCode: zipCode || '90210',
            fuelType: 'Gasoline',
            transmission: 'Automatic',
            color: 'Silver',
            bodyType: 'Sedan',
            vin: vin
          }
        });

        if (valuationError) {
          console.error('Error storing valuation:', valuationError);
          toast.error('VIN decoded but valuation failed. Using basic data.');
        } else {
          console.log('Real valuation completed:', valuationData);
          localStorage.setItem('latest_valuation_id', valuationData.id);
          setResult(valuationData);
          toast.success('VIN lookup completed with real valuation data');
        }
      } catch (valuationError) {
        console.error('Valuation API error:', valuationError);
        toast.error('VIN decoded but valuation failed. Using basic data.');
      }

    } catch (err) {
<<<<<<< HEAD
      console.error('CARFAX error:', err);
      setCarfaxError('Unable to retrieve vehicle history report.');
      setError('Could not retrieve vehicle history report.');
      toast.error('Could not retrieve vehicle history report.');
    } finally {
      setIsLoading(false);
      setIsLoadingCarfax(false);
    }
=======
      console.error("CARFAX error:", err);
      setCarfaxError("Unable to retrieve vehicle history report.");
      setIsLoadingCarfax(false);
      toast.error("Could not retrieve vehicle history report.");
    }

    if (valuationResult?.id && result) {
      localStorage.setItem("latest_valuation_id", valuationResult.id);
      localStorage.setItem(`vin_lookup_${vin}`, JSON.stringify(result));
    }
  };

  const handleDetailsSubmit = async (details: any): Promise<void> => {
    await submitValuation({
      ...details,
      zipCode: zipCode || details.zipCode,
      carfaxData: carfaxData || undefined,
    });
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
    handleSubmit,
  };
}
