
import { useState } from "react";
import { toast } from "sonner";
import { getCarfaxReport } from "@/utils/carfax/mockCarfaxService";
import { useVinDecoder } from "@/hooks/useVinDecoder";
import { useFullValuationPipeline } from "@/hooks/useFullValuationPipeline";

export function useVinDecoderForm() {
  const [vin, setVin] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [carfaxData, setCarfaxData] = useState<any>(null);
  const [carfaxError, setCarfaxError] = useState<string | null>(null);
  const [isLoadingCarfax, setIsLoadingCarfax] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data, loading, error } = useVinDecoder();
  const { runLookup, data: valuationResult, isLoading: isSubmittingValuation } = useFullValuationPipeline();

  // VIN → Decode → Real API → Save to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vin) {
      toast.error("Please enter a valid VIN");
      return;
    }

    try {
      setIsLoadingCarfax(true);
      setCarfaxData(null);
      setCarfaxError(null);

      if (!data) {
        toast.error("VIN lookup failed. Try again.");
        return;
      }

      setResult(data);
      await runLookup("vin", vin);

      const report = await getCarfaxReport(vin);
      setCarfaxData(report);
      setIsLoadingCarfax(false);

    } catch (err) {
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
    // Implementation for submitting additional details
    console.log("Submitting details:", details);
  };

  return {
    vin,
    setVin,
    zipCode,
    setZipCode,
    result,
    isLoading: loading,
    error,
    carfaxData,
    isLoadingCarfax,
    carfaxError,
    handleSubmit,
    handleDetailsSubmit,
  };
}
