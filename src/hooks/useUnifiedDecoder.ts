import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DecodedVehicleInfo } from "@/types/vehicle";
import { toast } from "sonner";

<<<<<<< HEAD
import { useState } from 'react';
import { decodeVin } from '@/services/vinService';
import { decodeLicensePlate, DecodedVehicleInfo } from '@/services/vehicleService';

export type DecoderType = 'vin' | 'plate';
=======
type DecodeType = "vin" | "plate" | "manual" | "photo";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface DecoderState {
  isLoading: boolean;
  error: string | null;
  data: DecodedVehicleInfo | null;
  decoderType: DecoderType | null;
  isValid: boolean;
}

<<<<<<< HEAD
export const useUnifiedDecoder = () => {
  const [state, setState] = useState<DecoderState>({
    isLoading: false,
    error: null,
    data: null,
    decoderType: null,
    isValid: false
  });

  // Reset the decoder state
  const resetDecoder = () => {
    setState({
      isLoading: false,
      error: null,
      data: null,
      decoderType: null,
      isValid: false
    });
  };

  // Decode a VIN number
  const decodeVinNumber = async (vin: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await decodeVin(vin);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to decode VIN');
      }
      
      setState({
        isLoading: false,
        error: null,
        data: response.data,
        decoderType: 'vin',
        isValid: true
      });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode VIN';
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
        decoderType: 'vin',
        isValid: false
      });
      return null;
    }
  };

  // Decode a license plate
  const decodePlate = async (plate: string, state: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await decodeLicensePlate(plate, state);
      setState({
        isLoading: false,
        error: null,
        data,
        decoderType: 'plate',
        isValid: true
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode license plate';
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
        decoderType: 'plate',
        isValid: false
      });
=======
export function useUnifiedDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(
    null,
  );

  const decode = async (
    type: DecodeType,
    params: {
      vin?: string;
      licensePlate?: string;
      state?: string;
      manual?: ManualEntry;
      zipCode?: string;
    },
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the Supabase edge function directly
      const { data, error: fnError } = await supabase.functions.invoke(
        "unified-decode",
        {
          body: {
            type,
            ...params,
          },
        },
      );

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error.message || data.error);

      if (!data.decoded) {
        throw new Error("No vehicle data returned");
      }

      if ("error" in data.decoded) {
        throw new Error(data.decoded.error);
      }

      const decodedInfo: DecodedVehicleInfo = {
        make: data.decoded.make,
        model: data.decoded.model,
        year: data.decoded.year,
        trim: data.decoded.trim,
        mileage: data.decoded.mileage,
        condition: data.decoded.condition,
        zipCode: data.decoded.zipCode,
        transmission: data.decoded.transmission,
        fuelType: data.decoded.fuelType,
        bodyType: data.decoded.bodyType,
        drivetrain: data.decoded.drivetrain,
        color: data.decoded.exteriorColor,
        vin: params.vin || data.decoded.vin,
      };

      setVehicleInfo(decodedInfo);

      toast.success(
        `Found: ${decodedInfo.year} ${decodedInfo.make} ${decodedInfo.model}`,
      );
      return decodedInfo;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Failed to decode vehicle information";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Decode error:", err);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return null;
    }
  };

  return {
<<<<<<< HEAD
    ...state,
    decodeVin: decodeVinNumber,
    decodePlate,
    resetDecoder
=======
    decode,
    isLoading,
    error,
    vehicleInfo,
    reset: () => {
      setVehicleInfo(null);
      setError(null);
    },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};
