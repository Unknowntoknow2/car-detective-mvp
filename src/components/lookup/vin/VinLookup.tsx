
import React, { useCallback, useState } from "react";
import { VINLookupForm } from "./VINLookupForm";
import { VinDecoderResults } from "./VinDecoderResults";
import { useVinDecoder } from "@/hooks/useVinDecoder";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { CarfaxErrorAlert } from "./CarfaxErrorAlert";
import { DecodedVehicleInfo } from "@/types/vehicle";

export const VinLookup = () => {
  const [vinNumber, setVinNumber] = useState("");
  const { data, loading, error } = useVinDecoder(vinNumber);

  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);

  const handleLookup = useCallback(() => {
    if (vinNumber) {
      console.log("Looking up VIN:", vinNumber);
    }
  }, [vinNumber]);

  const onReset = useCallback(() => {
    setVinNumber("");
  }, []);

  const typedResult = data as DecodedVehicleInfo | null;

  return (
    <div className="w-full">
      {!typedResult
        ? (
          <VINLookupForm
            value={vinNumber}
            onChange={handleVinChange}
            onSubmit={handleLookup}
            isLoading={loading}
            error={error}
          />
        )
        : (
          <>
            <VinDecoderResults
              data={typedResult}
              isLoading={loading}
            />
            <Button
              variant="outline"
              className="mt-4"
              onClick={onReset}
            >
              Lookup Another VIN
            </Button>
          </>
        )}

      {error && error.includes("Carfax")
        ? (
          <CarfaxErrorAlert error="Unable to retrieve Carfax vehicle history report." />
        )
        : error
        ? (
          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )
        : null}
    </div>
  );
};

export default VinLookup;
